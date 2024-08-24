declare namespace EventCardScssNamespace {
  export interface IEventCardScss {
    article: string;
    card: string;
    channel: string;
    confirmGoing: string;
    confirmLike: string;
    firstLine: string;
    going: string;
    icon: string;
    like: string;
    profile: string;
    text: string;
    time: string;
    timeSvg: string;
    timeText: string;
    title: string;
    toggle: string;
    toggleArea: string;
    toggleIcon: string;
    togglesLine: string;
    username: string;
  }
}

declare const EventCardScssModule: EventCardScssNamespace.IEventCardScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EventCardScssNamespace.IEventCardScss;
};

export = EventCardScssModule;
