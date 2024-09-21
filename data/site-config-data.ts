export type SiteConfigType = {
  title: string;
  description: string;
  icons: {
    icon: {
      url: string;
      href: string;
    };
  };
};

export const siteConfig: SiteConfigType = {
  title: "ElysianStart",
  description:
    "Explore exciting entry-level opportunities and internships in the realm of development, connecting you with premier companies across the globe. Embark on your career journey with us.",
  icons: {
    icon: {
      url: "/icons/logo.svg",
      href: "/icons/logo.svg",
    },
  },
};
