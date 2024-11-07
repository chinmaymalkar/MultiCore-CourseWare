import React, { useState } from "react";
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";
// import aboutImage from '../assets/about-image.jpg';

function About() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic here to handle form submission (e.g., send data to backend)
        console.log("Form submitted:", formData);
        // Reset form data
        setFormData({
            name: "",
            email: "",
            message: "",
        });
    };

    return (
        <div className="py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h2 className="text-center text-3xl font-bold mb-4">About Us</h2>
                        <Image src={"https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} alt="About MultiCore" fluid className="mb-4" />
                        <p>
                            MultiCore is a cutting-edge platform that revolutionizes the way
                            students learn and instructors teach. Our goal is to provide a
                            comprehensive and interactive learning experience for everyone.
                        </p>
                        <p>
                            At MultiCore, we believe in the power of education to transform
                            lives. That's why we offer a wide range of courses, from
                            programming to business management, designed to equip students
                            with the skills they need to succeed in today's fast-paced world.
                        </p>
                        <h3 className="mt-5">Our Mission</h3>
                        <p>
                            Our mission is to make quality education accessible to all,
                            regardless of background or location. We strive to create a
                            platform that fosters creativity, critical thinking, and lifelong
                            learning.
                        </p>
                        <h3 className="mt-5">Our Goals</h3>
                        <ul style={{ listStyleType: "dot", padding: 0 }}>
                            <li>
                                Provide high-quality, engaging courses taught by industry
                                experts.
                            </li>
                            <li>
                                Offer a user-friendly platform that enhances the learning
                                experience.
                            </li>
                            <li>
                                Empower students to achieve their academic and career goals.
                            </li>
                        </ul>

                        <h3 className="mt-5">Contact Us</h3>
                        <p>
                            If you have any questions or feedback, please feel free to contact
                            us at <a href="mailto:info@multicore.com">info@multicore.com</a>.
                            We'd love to hear from you!
                        </p>

                        <hr />

                        <h3 className="mt-5">Contact and Feedback Form</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formMessage">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter your message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default About;