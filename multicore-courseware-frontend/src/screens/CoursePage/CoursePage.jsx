import React from "react";
import { motion } from "framer-motion";

const CoursePage = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Course Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <img
                            src="https://via.placeholder.com/500x300"
                            alt="Course"
                            className="w-full h-48 object-cover"
                        />
                    </motion.div>

                    {/* Course Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-bold mb-4">Course Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                            euismod nisi vel mauris congue, vel facilisis velit facilisis.
                        </p>
                    </motion.div>

                    {/* Tutor Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-bold mb-4">Tutor Details</h2>
                        <div className="flex items-center">
                            <img
                                src="https://via.placeholder.com/64"
                                alt="Tutor"
                                className="w-16 h-16 rounded-full mr-4"
                            />
                            <div>
                                <h3 className="text-lg font-bold">John Doe</h3>
                                <p className="text-gray-700">Senior Instructor</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Other Labs and Related Information */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="mt-8 bg-white rounded-lg shadow-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">
                        Other Labs and Related Information
                    </h2>
                    <ul className="list-disc pl-4">
                        <li>Lab 1: Introduction to Programming</li>
                        <li>Lab 2: Data Structures and Algorithms</li>
                        <li>Lab 3: Web Development Fundamentals</li>
                        {/* Add more labs or related information */}
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};

export default CoursePage;