"use client";

import { motion } from "framer-motion";

import { testimonials } from "@/data/testimonials-data";
import Testimonial from "@/components/mains/testimonial";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Testimonials() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="visible"
    >
      {testimonials.map((testimonial, index) => (
        <motion.div
          className="rounded-md transition hover:shadow-xl lg:mx-auto lg:last:col-span-2 lg:last:w-2/3 xl:last:col-span-1 xl:last:mx-0 xl:last:w-full"
          key={index}
          variants={item}
        >
          <Testimonial testimonial={testimonial} />
        </motion.div>
      ))}
    </motion.div>
  );
}
