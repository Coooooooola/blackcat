declare namespace LoginPageScssNamespace {
  export interface ILoginPageScss {
    container: string;
    emailInput: string;
    input: string;
    inputBox: string;
    inputIcon: string;
    logo: string;
    main: string;
    name: string;
    passwordInput: string;
    signIn: string;
    welcome: string;
  }
}

declare const LoginPageScssModule: LoginPageScssNamespace.ILoginPageScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoginPageScssNamespace.ILoginPageScss;
};

export = LoginPageScssModule;
