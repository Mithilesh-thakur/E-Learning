import React from "react";
import { motion } from "framer-motion";

const Content = () => {
  return (
    <>
    <div className="sm:flex items-center max-w-screen mx-auto px-10 py-12">
      {/* Image Section */}
      <motion.div
        className="sm:w-1/2 p-10"
        initial={{ rotateY: -45, opacity: 0 }}
        whileInView={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="image object-center text-center">
          <motion.img
            src="https://i.pinimg.com/1200x/c1/55/bb/c155bbaf77944bfa767d8b357c53583b.jpg"
            alt="About"
            className="mx-auto"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </motion.div>

      {/* Text Section */}
      <motion.div
        className="sm:w-1/2 p-5"
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="text">
          <span className="text-gray-500 border-b-2 border-purple-600 uppercase">
            About us
          </span>
          <h2 className="my-4 font-bold text-3xl sm:text-4xl">
            About <span className="text-purple-600">Our Platform</span>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We deliver high-quality e-learning experiences through engaging lectures,
            video content, interactive modules, and personalized learning paths to
            help you unlock your true potential.
          </p>
        </div>
      </motion.div>
    </div>
    
    </>
  );
};

export default Content;
