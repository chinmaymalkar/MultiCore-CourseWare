import React from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";



const CourseLandingScreen = () => {

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const jhubBaseUrl = process.env.REACT_APP_API_BASE_JHUB_URL;
    const jhubAdminToken = process.env.REACT_APP_API_JHUB_ADMIN_TOKEN;

    const { courseId } = useParams();
    const [course, setCourse] = useState([]);
    const [courseContent, setCourseContent] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [isTokenFetched, setIsTokenFetched] = useState(false);
    const [jhubToken, setJhubToken] = useState('');

    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [courseCertificate, setCourseCertificate] = useState([]);

    const [expanded, setExpanded] = useState(false);
    const maxLength = 150; // Adjust the maximum length of the description to show initially
    const truncatedDescription = course.description && course.description.length > maxLength ? course.description.substring(0, maxLength) + "..." : course.description;

    const [visitedButtons, setVisitedButtons] = useState([]);

    const handleViewCertificate = () => {
        setShowCertificateModal(true);
    };


    const { accessToken } = useSelector(
        state => state.auth
    );


    /// Get Token For JHUB server
    useEffect(() => {
        const fetch = async () => {
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
                const response = await axios.get(`${baseUrl}/notebook-utlis/get-jhub-user-token/`, { headers });

                setJhubToken(response.data.token);
                setFirstName(response.data.first_name);
                setIsTokenFetched(true);

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        // Call fetch function
        fetch();

    }, [baseUrl]);

    /// Get Course Detail
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
                const response = await axios.get(`${baseUrl}/courses/course/detail/${courseId}/`, { headers });

                setCourse(response.data.data);

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [baseUrl]);

    /// get course-content and progress
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
                // const response = await axios.get(`${baseUrl}/courses/${courseId}/content/`, { headers });
                const response = await axios.get(`${baseUrl}/courses/get-course/${courseId}/contents/progress/`, { headers });

                setCourseContent(response.data.course_content_progress);

                const courseCompleted = response.data.course_completed;
                if (courseCompleted) {
                    setCourseCompleted(courseCompleted);
                    handleCheckCourseProgress();
                }

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [baseUrl]);


    // Function to handle button click and mark it as visited mark the content visited or completed
    const handleButtonClick = (contentId, notebookName) => {
        // Check if the button is already marked as visited
        if (!visitedButtons.includes(contentId)) {
            // If not visited, add it to the visitedButtons state
            setVisitedButtons([...visitedButtons, contentId]);
        }

        if (isTokenFetched) {
            const url = `${jhubBaseUrl}/user/${firstName.toLowerCase()}/notebooks/${notebookName}?token=${jhubToken}`;
            window.open(url, '_blank'); // Open the URL in a new tab
        }

        const fetch = async () => {
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

                const body = {
                };

                // Make the HTTP request with the authorization header
                const response = await axios.post(`${baseUrl}/courses/post-course/${courseId}/contents/${contentId}/progress/`, body, { headers });

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetch();
        window.location.reload();

    };

    const handleCheckCourseProgress = () => {

        // check is certificate is completed
        const markCourseCompleted = async () => {
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

                const body = {
                };

                // Make the HTTP request with the authorization header
                const response = await axios.post(`${baseUrl}/courses/course-progress/${courseId}/`, body, { headers });

                console.log(response.data)
                // try {
                //     console.log(response.data)
                //     const completed = response.data.data.completed;
                //     setCourseCompleted(completed);
                // }
                // catch (error) {
                //     setCourseCompleted(false);
                // }

                fetchCertificate();


            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        markCourseCompleted();

    };

    // fetch certificate
    const fetchCertificate = () => {

        const fetch = async () => {
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
                const response = await axios.get(`${baseUrl}/courses/get-certificate/${courseId}/`, { headers });

                console.log(response.data);
                setCourseCertificate(response.data.data);


            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetch();
    }

    return (
        <>
            <div className="bg-gray-100 min-h-screen">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h2>{course.title}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Course Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                            <img
                                src={course.image}
                                alt="Course"
                                className="w-full h-48 object-contain"
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
                                {expanded ? course.description : truncatedDescription}
                                {course.description && course.description.length > maxLength && (
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setExpanded(!expanded)}
                                    >
                                        {expanded ? 'Read Less' : 'Read More'}
                                    </button>
                                )}
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

                    <Col className="mt-4">
                        {courseContent.map((content) => (
                            <Row key={content.course_content.id} className="mb-4">
                                <Button
                                    className="me-3"
                                    variant={
                                        (!visitedButtons.includes(content.course_content.id) && !content.completed) ? "primary" : "secondary"
                                    }
                                    onClick={isTokenFetched ? () => handleButtonClick(content.course_content.id, content.course_content.content) : null} // Call handleButtonClick function only when isTokenFetched is true
                                    disabled={!isTokenFetched} // Disable the button when isTokenFetched is false
                                >
                                    {isTokenFetched ? (
                                        content.course_content.title
                                    ) : (
                                        "Lab is being set up..."
                                    )}
                                </Button>

                            </Row>
                        ))}

                        {courseCompleted && (
                            <Row className="mb-4">
                                <Button variant="success" onClick={handleViewCertificate}>
                                    View Certificate
                                </Button>
                            </Row>
                        )}

                        <Modal show={showCertificateModal} onHide={() => setShowCertificateModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Certificate</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <img src={courseCertificate.certificate_image} alt="Certificate" style={{ maxWidth: '100%', maxHeight: '80vh', margin: 'auto', display: 'block' }} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowCertificateModal(false)}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>


                        <Row>
                            <Button variant="secondary" href="/home">
                                Back to Courses
                            </Button>
                        </Row>
                    </Col>


                </div>
            </div>
        </>
    );
};

export default CourseLandingScreen;

// `${jhubBaseUrl}/user/${firstName.toLowerCase()}/notebooks/${content.course_content.content}?token=${isTokenFetched ? jhubToken : ''}`