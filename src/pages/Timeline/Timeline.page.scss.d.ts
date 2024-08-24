declare namespace TimelinePageScssNamespace {
  export interface ITimelinePageScss {
    container: string;
    mask: string;
    viewport: string;
  }
}

declare const TimelinePageScssModule: TimelinePageScssNamespace.ITimelinePageScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TimelinePageScssNamespace.ITimelinePageScss;
};

export = TimelinePageScssModule;
