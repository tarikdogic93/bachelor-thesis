import {
  Compass,
  LucideIcon,
  PlusCircle,
  Search,
  ShieldCheck,
} from "lucide-react";

export type BenefitType = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const benefits: BenefitType[] = [
  {
    icon: Search,
    title: "Explore a wide range of entry-level job offers and internships",
    description:
      "Dive into a vast pool of job offers and internships. We have gathered opportunities from diverse industries, making it easy to find your ideal career.",
  },
  {
    icon: Compass,
    title: "User-friendly interface designed for enhanced user experience",
    description:
      "Navigate with ease. Our intuitive interface ensures a smooth and hassle-free experience, helping you find and apply for jobs and internships seamlessly.",
  },
  {
    icon: PlusCircle,
    title: "Effortless posting for companies - reach the right candidates",
    description:
      "Simplify your hiring process. Our platform offers seamless job posting, ensuring your opportunities reach the most qualified candidates effortlessly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure and confidential - safeguarding your data is our priority",
    description:
      "Rest easy with us. We prioritize your data security and confidentiality, providing a safe and trusted environment for your job search or recruitment needs.",
  },
];
