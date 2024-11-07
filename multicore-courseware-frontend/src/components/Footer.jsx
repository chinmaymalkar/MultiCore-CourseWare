import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-lg font-bold mb-2">About Us</h3>
                        <p>
                            Multicore Courseware Platform is dedicated to providing
                            high-quality educational resources for students and professionals
                            alike. Our mission is to make learning accessible, engaging, and
                            rewarding.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Courses</h3>
                        <ul>
                            <li>Course 1</li>
                            <li>Course 2</li>
                            <li>Course 3</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Quotes</h3>
                        <p className="italic">
                            "The platform has helped me immensely in understanding complex
                            concepts and improving my skills." - John Doe
                        </p>
                        <p className="italic">
                            "I love the interactive nature of the courses. It's like having a
                            personal tutor." - Jane Smith
                        </p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p>
                        © {new Date().getFullYear()} Multicore Courseware Platform. All
                        Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;