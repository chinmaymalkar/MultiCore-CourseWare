import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PaymentScreen = () => {

    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const { courseId } = useParams();

    const { accessToken } = useSelector(
        state => state.auth
    );

    // Function to handle course enrollment
    const navigate = useNavigate();
    const handleSubmit = () => {
        // Redirect to the enrollment page for the selected course
        fetchEnroll();
        navigate(`/`); // Pass courseId to the enrollment page
    };

    const fetchEnroll = async () => {
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
                "course": courseId
            };

            // Make the HTTP request with the authorization header and the request body
            const response = await axios.post(`${baseUrl}/courses/enrollments-create/`, body, { headers });
            console.log(response.data);
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };


    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <h2 className="text-center mb-4">Secure Payment Gateway</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="cardNumber">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control type="text" placeholder="Enter card number" />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="expiryDate">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control type="text" placeholder="MM/YY" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="cvv">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" placeholder="CVV" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="cardHolder">
                            <Form.Label>Card Holder Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter card holder name" />
                        </Form.Group>
                        <br />
                        <Button variant="primary" type="submit" block>
                            Pay Now
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentScreen;
