"use client";

import { motion } from "framer-motion";

import { benefits } from "@/data/benefits-data";
import Benefit from "@/components/mains/benefit";

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Benefits() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      whileInView="visible"
    >
      {benefits.map((benefit, index) => (
        <motion.div
          className="group relative lg:last:col-span-3 lg:last:mx-auto lg:last:w-2/3 xl:last:col-span-1 xl:last:mx-0 xl:last:w-full"
          key={index}
          variants={item}
        >
          <div className="absolute -inset-0.5 rounded-lg bg-via opacity-0 blur transition group-hover:opacity-100 group-hover:duration-200" />
          <Benefit benefit={benefit} />
        </motion.div>
      ))}
    </motion.div>
  );
}
