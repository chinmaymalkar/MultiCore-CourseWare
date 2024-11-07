import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


function Course({ course, isEnrolled }) {
    // useNavigate hook for navigation
    const navigate = useNavigate()

    // Function to handle course enrollment
    const handleEnroll = (courseId) => {
        // Redirect to the enrollment page for the selected course
        navigate(`/enrollment/${courseId}`); // Pass courseId to the enrollment page
    };

    const handleView = (courseId) => {
        // Redirect to the enrollment page for the selected course
        navigate(`/course/${courseId}`); // Pass courseId to the enrollment page
    };

    return (
        <div
            onClick={() => {
                if (isEnrolled) {
                    handleView(course.id);
                }
                else {
                    handleEnroll(course.id);
                }
            }}
            className=" cursor-pointer flex gap-y-2  py-3 rounded-md px-2 flex-col items-center w-[300px] min-h-[200px] bg-gray-200 hover:scale-[1.02] transition-all duration-200"
        >
            <img
                className="w-[250px] h-[250px] rounded-md"
                alt=""
                src={course.image}
            />
            <div className=" flex flex-col justify-center items-center">
                <p className=" font-bold text-2xl">{course.title}</p>
                <p className=" px-4 text-justify">{course.tag}</p>
            </div>
        </div>
    );
}

export default Course;