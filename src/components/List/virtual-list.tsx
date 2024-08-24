import React, { ReactElement, useLayoutEffect, useRef } from 'react';
import style from './List.scss';

function ListItemView({
  top,
  children,
  updateHeight,
}: {
  top: number;
  children: ReactElement;
  updateHeight(div: HTMLDivElement): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      updateHeight(ref.current);
    }
  }, [updateHeight, children]);
  return (
    <div ref={ref} className={style.listItem} style={{ top }}>
      {children}
    </div>
  );
}

export class ListItem {
  top: number | null = null;
  height: number | null = null;
  offset = 0;
  defaultHeight: number;

  private element: ReactElement | null = null;
  readonly key: string;
  private readonly content: ReactElement;
  constructor(options: { key: string; defaultHeight: number; content: ReactElement }) {
    const { key, defaultHeight, content } = options;
    this.key = key;
    this.defaultHeight = defaultHeight;
    this.content = content;
  }

  private updateHeight = (div: HTMLDivElement) => {
    if (this.height == null) {
      this.height = div.offsetHeight;
      this.offset = this.height - this.defaultHeight;
    }
  };

  clearHeight() {
    if (this.height !== null) {
      this.defaultHeight = this.height;
      this.height = null;
    }
  }

  inViewport(y1: number, y2: number, recoup: number) {
    const height = this.getHeight();
    return recoup <= y2 && recoup + height >= y1;
  }

  getHeight() {
    const { height, defaultHeight } = this;
    return height === null ? defaultHeight : height;
  }

  render(top: number) {
    const { element, key, content, updateHeight } = this;
    if (this.top === top && element) {
      return element;
    }

    this.top = top;
    this.element = (
      <ListItemView key={key} top={top} updateHeight={updateHeight}>
        {content}
      </ListItemView>
    );

    return this.element;
  }
}

function render(items: ListItem[], top: number, start: number, end: number) {
  const elements: ReactElement[] = [];
  let nextTop = top;
  for (let i = start; i <= end; i++) {
    elements.push(items[i].render(nextTop));
    nextTop += items[i].getHeight();
  }
  return elements;
}

export class VirtualList {
  viewportHeight = 0;
  listHeight = 0;
  scrollTop = 0;
  viewportElements: ReactElement[] = [];
  relativeStart = -1;

  reflow(items: ListItem[], nextScrollTop: number, buffer = 0) {
    const { relativeStart, viewportHeight, viewportElements } = this;

    // 1. make scrollTop & viewport correct; Viewport's upper edge is "y1", lower edge is "y2"
    let offsetSum = 0;
    for (let i = 0; i < relativeStart; i++) {
      offsetSum += items[i].offset;
    }
    const y1 = nextScrollTop + offsetSum;
    const y2 = y1 + viewportHeight;
    this.scrollTop = y1;

    // 2. make element in viewport correct
    let recoup = 0;
    let start = items.length - 1;
    let end = Number.MIN_SAFE_INTEGER;
    let top = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.inViewport(y1 - buffer, y2 + buffer, recoup)) {
        top = Math.min(top, recoup);
        start = Math.min(start, i);
        end = Math.max(end, i);
      }
      recoup += item.getHeight();
      item.offset = 0;
    }

    // 3. make listHeight correct
    this.listHeight = recoup;

    // 4. rendering phase
    const elements = render(items, top, start, end);
    if (
      viewportElements.length !== elements.length ||
      viewportElements.some((el, i) => el !== elements[i])
    ) {
      this.viewportElements = elements;
    } else {
      this.relativeStart = start; // memo the last correct viewport items index
    }

    return { viewportElements: this.viewportElements, listHeight: this.listHeight };
  }
}
