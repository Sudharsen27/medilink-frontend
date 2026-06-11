import React from "react";
import { motion } from "framer-motion";

const PageContainer = ({ children, className = "", maxWidth = "max-w-7xl" }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${className}`}
  >
    {children}
  </motion.div>
);

export default PageContainer;
