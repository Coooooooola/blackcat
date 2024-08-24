declare namespace AppPageScssNamespace {
  export interface IAppPageScss {
    app: string;
  }
}

declare const AppPageScssModule: AppPageScssNamespace.IAppPageScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppPageScssNamespace.IAppPageScss;
};

export = AppPageScssModule;
