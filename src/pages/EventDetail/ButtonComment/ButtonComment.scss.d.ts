declare namespace ButtonCommentScssNamespace {
  export interface IButtonCommentScss {
    crossSvg: string;
    input: string;
    inputBox: string;
    send: string;
    sendSvg: string;
  }
}

declare const ButtonCommentScssModule: ButtonCommentScssNamespace.IButtonCommentScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonCommentScssNamespace.IButtonCommentScss;
};

export = ButtonCommentScssModule;
