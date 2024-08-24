declare namespace SearchScssNamespace {
  export interface ISearchScss {
    active: string;
    channelArea: string;
    search: string;
    searchBtn: string;
    searchHint: string;
    searchSvg: string;
    searchTextBox: string;
    selectArea: string;
    selectChannel: string;
    selectList: string;
    selectText: string;
    selectTitle: string;
  }
}

declare const SearchScssModule: SearchScssNamespace.ISearchScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SearchScssNamespace.ISearchScss;
};

export = SearchScssModule;
