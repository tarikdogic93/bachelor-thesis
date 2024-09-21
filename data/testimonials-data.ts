export type TestimonialType = {
  src: string;
  alt: string;
  content: string;
  description: string;
  name: string;
  company: string;
  role: string;
  date: string;
};

export const testimonials: TestimonialType[] = [
  {
    src: "/images/testimonial1.jpg",
    alt: "DM",
    content:
      "I was struggling to find a fitting position after graduating, but with the platform's vast job listings, I found my dream job in no time. Thank you for making my transition from student to professional so smooth!",
    description: "Recent Graduate",
    name: "David M.",
    company: "Microsoft",
    role: "Software Developer",
    date: "April 2022",
  },
  {
    src: "/images/testimonial2.jpg",
    alt: "SL",
    content:
      "As a young woman aspiring to gain real-world experience, I was worried about where to start. The user-friendly interface and comprehensive internship listings helped me secure a valuable internship opportunity.",
    description: "Aspiring Professional",
    name: "Sarah L.",
    company: "Google",
    role: "QA Intern",
    date: "June 2022",
  },
  {
    src: "/images/testimonial3.jpg",
    alt: "MH",
    content:
      "We've found dedicated employees who bring new energy to our team. The quality of candidates and ease in posting jobs are unparalleled, simplifying our recruitment process and saving time and resources.",
    description: "HR Manager",
    name: "Mark H.",
    company: "Facebook",
    role: "HR Manager",
    date: "March 2023",
  },
];
