export type TitlesType = {
  "": string;
  signin: string;
  signup: string;
  forgotPassword: string;
  resetPassword: string;
  verify: string;
};

export type DescriptionsType = {
  "": string;
  signin: string;
  signup: string;
  forgotPassword: string;
  resetPassword: string;
  verify: string;
};

export type FooterTextsType = {
  signin: {
    paragraphText: string;
    buttonText: string;
  };
  signup: {
    paragraphText: string;
    buttonText: string;
  };
  forgotPassword: {
    paragraphText: string;
    buttonText: string;
  };
  resetPassword: {
    paragraphText: string;
    buttonText: string;
  };
  verify: {
    paragraphText: string;
    buttonText: string;
  };
};

export const titles: TitlesType = {
  "": "Authentication",
  signin: "Welcome back",
  signup: "Join us today",
  forgotPassword: "Forgot password",
  resetPassword: "Reset password",
  verify: "Verify credentials",
};

export const descriptions: DescriptionsType = {
  "": "You can choose between sign-in, sign-up or forgot password options",
  signin:
    "Sign in to your account to continue exploring and enjoying our services",
  signup:
    "Create an account to unlock a world of opportunities and exclusive features",
  forgotPassword: "Regain hassle-free access to your account",
  resetPassword: "Strengthen your security with a new password",
  verify:
    "Ensure the security of your account and access all features seamlessly",
};

export const footerTexts: FooterTextsType = {
  signin: {
    paragraphText: "Don't have an account yet? Click here to ",
    buttonText: "sign up",
  },
  signup: {
    paragraphText: "Already have an account? Click here to ",
    buttonText: "sign in",
  },
  forgotPassword: {
    paragraphText: "Remembered your password? Click here to ",
    buttonText: "sign in",
  },
  resetPassword: {
    paragraphText: "Didn't recieve a code? Click here to ",
    buttonText: "resend",
  },
  verify: {
    paragraphText: "Didn't recieve a code? Click here to ",
    buttonText: "resend",
  },
};
