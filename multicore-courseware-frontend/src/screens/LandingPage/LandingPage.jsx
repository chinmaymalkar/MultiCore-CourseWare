import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Carousel } from "react-bootstrap";
import Footer from "../../components/Footer";
import Course from "../../components/Course";
import Hero from "../../components/Hero";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';


function LandingPage() {
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const { accessToken } = useSelector(
        state => state.auth
    );

    useEffect(() => {
        const fetchCourses = async () => {
            try {

                // Check if access token exists
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }

                // Set the authorization header with the access token
                const headers = {
                    'Authorization': `Bearer ${accessToken}`
                };

                // Make the HTTP request with the authorization header
                const response = await axios.get(`${baseUrl}/courses/course-list/`, { headers });
                setCourses(response.data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [baseUrl]);


    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                // Check if access token exists
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }

                // Set the authorization header with the access token
                const headers = {
                    'Authorization': `Bearer ${accessToken}`
                };

                // Make the HTTP request with the authorization header
                const response = await axios.get(`${baseUrl}/courses/enrollments-list-detail/`, { headers });
                setEnrolledCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchEnrolledCourses();
    }, [baseUrl]);

    const isCourseEnrolled = (courseId) => {
        return enrolledCourses.some(course => course.course === courseId);
    };

    return (
        <div className=" relative mb-10">
            {/* Hero Section */}

            <div className="  text-black py-20 ">
                <div className="container mx-auto flex flex-col items-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to{" "}
                        <span className=" text-blue-500"> MultiCore CourseWare</span>
                    </h1>
                    <p className="text-lg md:text-xl text-center max-w-lg">
                        <span className=" text-xl font-bold">"</span>Learn from the best,
                        expand your knowledge, and advance your career with our diverse
                        range of courses. <span className=" text-xl font-boldb">"</span>
                    </p>
                </div>
            </div>

            <Carousel className=" mt-3">
                <Carousel.Item>
                    <img
                        className="d-block w-100 h-[500px]  object-center"
                        src="https://media.istockphoto.com/id/1416048929/photo/woman-working-on-laptop-online-checking-emails-and-planning-on-the-internet-while-sitting-in.jpg?s=612x612&w=0&k=20&c=mt-Bsap56B_7Lgx1fcLqFVXTeDbIOILVjTdOqrDS54s="
                        alt="First slide"
                    />
                    <Carousel.Caption className=" bg-gray-500  bg-opacity-75">
                        <h3>Parallel Thinking</h3>
                        <p>
                            Explore the basics of parallel thinking, learning how to apply
                            principles and techniques in real-world scenarios.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 h-[500px] object-center content-center"
                        src="https://media.istockphoto.com/id/1349390515/photo/paperless-workplace-idea-e-signing-electronic-signature-document-management-businessman-signs.jpg?s=612x612&w=0&k=20&c=EyQl13diegNV5DVLnb0krcAcRDhL7NiSA7IEVImZs6Q="
                        alt="Second slide"
                    />
                    <Carousel.Caption className=" bg-gray-500  bg-opacity-75">
                        <h3>Advanced Parallel Thinking Strategies</h3>
                        <p>
                            Discover advanced techniques for optimizing parallel processing,
                            tackling complex challenges efficiently.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 h-[500px] "
                        src="https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_640.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption className=" bg-gray-500  bg-opacity-75">
                        <h3>Parallel Thinking in Action</h3>
                        <p>
                            Gain hands-on experience with real-world projects and simulations,
                            mastering parallel thinking skills for success.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            {/* Course Cards */}
            <div className=" flex gap-x-5 gap-y-5  mt-6">
                {courses.map((course) => (
                    <Course key={course.id}
                        course={course}
                        isEnrolled={isCourseEnrolled(course.id)}
                    />
                ))}
            </div>
            {/* <Footer></Footer> */}
        </div>
    );
}

export default LandingPage;