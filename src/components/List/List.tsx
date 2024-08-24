import { assert } from '@src/share';
import React, {
  RefObject,
  UIEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import style from './List.scss';
import { ListItem, VirtualList } from './virtual-list';

function useTrace(visible: boolean) {
  const traceRef = useRef<{ prev?: boolean; next?: boolean }>({ prev: undefined, next: undefined });
  const trace = traceRef.current;
  if (visible || trace.next !== undefined) {
    trace.prev = trace.next;
    trace.next = visible;
  }

  return trace;
}

function useCorrectScrollTop(
  visible: boolean,
  scrollTop: number,
  scrollRef: RefObject<HTMLDivElement>,
) {
  const trace = useTrace(visible);
  useLayoutEffect(
    function correctScrollTopAfterRevisible() {
      if (visible && trace.prev === false && trace.next === true) {
        assert(scrollRef.current);
        scrollRef.current.scrollTop = scrollTop;
      }
    },
    [scrollRef, scrollTop, trace, visible],
  );
}

function useListItems(nextListItems: ListItem[], list: VirtualList) {
  const [listItems, setListItems] = useState(nextListItems);

  useEffect(() => {
    if (list.relativeStart !== -1) {
      const relative = listItems[list.relativeStart];
      list.relativeStart = nextListItems.findIndex(item => item.key === relative.key);
    }
  }, [list, listItems, nextListItems]);

  useEffect(() => {
    setListItems(prev => {
      const map = new Map<string, ListItem>();
      for (const listItem of prev) {
        map.set(listItem.key, listItem);
      }

      const finalListItems = nextListItems.slice();
      for (const listItem of finalListItems) {
        const prevItem = map.get(listItem.key);
        if (prevItem) {
          listItem.defaultHeight = prevItem.getHeight();
        } else {
          listItem.offset = -listItem.defaultHeight;
        }
      }
      return finalListItems;
    });
  }, [nextListItems]);
  return listItems;
}

function useScroll(nextListItems: ListItem[], visible: boolean, buffer?: number) {
  const list = useMemo(() => new VirtualList(), []);
  const listItems = useListItems(nextListItems, list);

  const scrollRef = useRef<HTMLDivElement>(null);
  const realScrollTopRef = useRef(list.scrollTop);

  const [listHeight, setListHeight] = useState(list.listHeight);
  const [elements, setElement] = useState(list.viewportElements);

  useCorrectScrollTop(visible, list.scrollTop, scrollRef);

  const reflowList = useCallback(
    (y1: number) => {
      const { viewportElements, listHeight } = list.reflow(listItems, y1, buffer);
      setElement(viewportElements);
      setListHeight(listHeight);
    },
    [buffer, list, listItems],
  );

  useLayoutEffect(() => {
    if (scrollRef.current && visible) {
      const { scrollTop, offsetHeight } = scrollRef.current;
      list.viewportHeight = offsetHeight;
      realScrollTopRef.current = scrollTop;
    }
  }, [list, visible]);

  useLayoutEffect(
    function reflow() {
      const scrollDiv = scrollRef.current;
      if (scrollDiv && visible) {
        reflowList(list.scrollTop);
        const { scrollTop } = list;
        if (list.viewportElements === elements && realScrollTopRef.current !== scrollTop) {
          scrollDiv.scrollTop = scrollTop;
          realScrollTopRef.current = scrollTop;
        }
      }
    },
    [list, elements, reflowList, visible],
  );

  return {
    elements,
    listHeight,
    scrollRef,
    onScroll({ currentTarget: { scrollTop } }: UIEvent<HTMLDivElement>) {
      realScrollTopRef.current = scrollTop;
      reflowList(scrollTop);
    },
  };
}

export function List({
  visible,
  listItems,
  buffer,
}: {
  visible: boolean;
  listItems: ListItem[];
  buffer?: number;
}) {
  const { elements, listHeight, scrollRef, onScroll } = useScroll(listItems, visible, buffer);
  return (
    (visible || null) && (
      <div ref={scrollRef} className={style.list} onScroll={onScroll}>
        <div style={{ height: listHeight }}>{elements}</div>
      </div>
    )
  );
}
