declare namespace ProfileScssNamespace {
  export interface IProfileScss {
    profileImg: string;
    profileSvg: string;
  }
}

declare const ProfileScssModule: ProfileScssNamespace.IProfileScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProfileScssNamespace.IProfileScss;
};

export = ProfileScssModule;
