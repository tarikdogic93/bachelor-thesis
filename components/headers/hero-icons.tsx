"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.3,
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

export default function HeroIcons() {
  return (
    <div className="relative hidden h-96 w-full md:block">
      <Image
        className="object-contain"
        priority
        src="/hero.svg"
        alt="Hero"
        fill
      />
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div
          className="absolute right-0 top-16 hidden xl:block 2xl:right-20 3xl:right-40"
          variants={item}
        >
          <Image src="/star1.svg" alt="Star" width={30} height={30} />
        </motion.div>
        <motion.div
          className="absolute right-28 top-52 hidden xl:block 2xl:right-48 3xl:right-64"
          variants={item}
        >
          <Image src="/star1.svg" alt="Star" width={30} height={30} />
        </motion.div>
        <motion.div
          className="absolute left-60 top-80 hidden xl:block 2xl:left-80 3xl:left-96"
          variants={item}
        >
          <Image src="/star1.svg" alt="Star" width={30} height={30} />
        </motion.div>
        <motion.div
          className="absolute right-28 top-4 hidden xl:block 2xl:right-48 3xl:right-64"
          variants={item}
        >
          <Image src="/star2.svg" alt="Star" width={45} height={45} />
        </motion.div>
        <motion.div
          className="absolute left-0 top-60 hidden xl:block 2xl:left-20 3xl:left-40"
          variants={item}
        >
          <Image src="/star2.svg" alt="Star" width={35} height={35} />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-16 hidden xl:block 2xl:right-36 3xl:right-56"
          variants={item}
        >
          <Image src="/star3.svg" alt="Star" width={30} height={30} />
        </motion.div>
        <motion.div
          className="absolute left-32 top-40 hidden xl:block 2xl:left-52 3xl:left-72"
          variants={item}
        >
          <Image src="/star3.svg" alt="Star" width={30} height={30} />
        </motion.div>
        <motion.div
          className="absolute left-[480px] top-14 hidden 4xl:block"
          variants={item}
        >
          <Image src="/star1.svg" alt="Star" width={35} height={35} />
        </motion.div>
        <motion.div
          className="absolute right-[400px] top-60 hidden 4xl:block"
          variants={item}
        >
          <Image src="/star2.svg" alt="Star" width={35} height={35} />
        </motion.div>
        <motion.div
          className="absolute left-0 top-10 hidden 4xl:block"
          variants={item}
        >
          <Image src="/star2.svg" alt="Star" width={35} height={35} />
        </motion.div>
        <motion.div
          className="absolute right-[480px] top-14 hidden 4xl:block"
          variants={item}
        >
          <Image src="/star3.svg" alt="Star" width={35} height={35} />
        </motion.div>
      </motion.div>
    </div>
  );
}
