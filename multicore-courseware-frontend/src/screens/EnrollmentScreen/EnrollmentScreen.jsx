import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";



const EnrollmentScreen = () => {

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const [course, setCourse] = useState([]);
  const { courseId } = useParams();

  const { accessToken } = useSelector(
    state => state.auth
  );

  // Function to handle course enrollment
  const navigate = useNavigate();
  const handleEnroll = () => {
    // Redirect to the enrollment page for the selected course
    navigate(`/payment/${courseId}`); // Pass courseId to the enrollment page
  };

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

  // return (
  //   <Container className="mt-5">
  //     <Row className="justify-content-center">
  //       <Col xs={12} md={8} lg={6}>
  //         <h1>Welcome to our Course Platform</h1>
  //         <p>Explore a wide range of courses and enhance your skills.</p>
  //         <p>{course.description}</p>
  //         <Button variant="primary" onClick={handleEnroll} block>Enroll</Button>
  //       </Col>
  //     </Row>
  //   </Container>
  // );

  const [expanded, setExpanded] = useState(false);
  const maxLength = 150; // Adjust the maximum length of the description to show initially

  const truncatedDescription = course.description && course.description.length > maxLength ? course.description.substring(0, maxLength) + "..." : course.description;


  return (
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

        <br />
        <Button variant="primary" onClick={handleEnroll} block>Enroll</Button>

      </div>
    </div>
  );

};

export default EnrollmentScreen;