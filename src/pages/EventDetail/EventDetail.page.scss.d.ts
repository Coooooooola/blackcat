declare namespace EventDetailPageScssNamespace {
  export interface IEventDetailPageScss {
    active: string;
    address: string;
    addressDetail: string;
    ampm: string;
    article: string;
    bigTime: string;
    bottom: string;
    bottomClickable: string;
    bottomLeft: string;
    bottomRight: string;
    bottomSvg: string;
    box: string;
    channel: string;
    channelLine: string;
    comment: string;
    commentBrief: string;
    commentContent: string;
    commentDate: string;
    commentMiddle: string;
    commentProfile: string;
    commentUsername: string;
    container: string;
    date: string;
    display: string;
    divider: string;
    gallery: string;
    goingSvg: string;
    header: string;
    icon: string;
    image: string;
    likeSvg: string;
    map: string;
    notice: string;
    participantBox: string;
    participantLeft: string;
    participantProfile: string;
    participantProfiles: string;
    participantSvg: string;
    profile: string;
    profileLine: string;
    replySvg: string;
    scroller: string;
    section: string;
    subDivider: string;
    subTitle: string;
    tab: string;
    tabs: string;
    textBox: string;
    timeDate: string;
    timeDateSvg: string;
    timeDivider: string;
    titleLine: string;
    username: string;
    when: string;
  }
}

declare const EventDetailPageScssModule: EventDetailPageScssNamespace.IEventDetailPageScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EventDetailPageScssNamespace.IEventDetailPageScss;
};

export = EventDetailPageScssModule;
