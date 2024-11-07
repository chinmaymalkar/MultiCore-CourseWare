import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import "../../index.css";

import { ThreeDots } from "react-loader-spinner";
// import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register } from '../../features/actions/authActions';

const RegisterScreen = () => {
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { user, registered, loading } = useSelector(state => state.auth);

    useEffect(() => {
        // Redirect if isAuthenticated is true
        if (registered) {
            navigate('/');
        }
    }, [registered, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!first_name || !last_name || !mobile || !email || !password || !confirmPassword) {
            toast.error("All Fields are mandatory");
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            try {
                dispatch(register({ first_name, last_name, email, mobile, password, otp }));
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };
    return (
        <FormContainer>
            <h1 className="text-center text-primary">Register</h1>
            <Form onSubmit={submitHandler}>
                <Row className="mb-3">

                    <Form.Group as={Col} className="my-2" controlId="first_name">
                        <Form.Label className=" font-semibold">First Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter first name"
                            value={first_name}
                            onChange={(e) => setFirst_name(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} className="my-2" controlId="last_name">
                        <Form.Label className=" font-semibold">Last Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter last name"
                            value={last_name}
                            onChange={(e) => setLast_name(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} className="my-2" controlId="email">
                        <Form.Label className="font-semibold">Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} className="my-2" controlId="mobile">
                        <Form.Label className="font-semibold">Mobile No.</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="Enter mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} className="my-2 " controlId="password">
                        <Form.Label className="font-semibold">Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} className="my-2" controlId="confirmPassword">
                        <Form.Label className=" font-semibold">Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Row>

                <Row className="mb-3">

                    <Form.Group as={Col} controlId="formGridOTP">
                        <Form.Label>OTP</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-[20%] py-2  px-3 mt-3"
                    >
                        Send OTP
                    </Button>

                </Row>

                <div className=" w-full flex justify-center items-center">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-[40%] py-2  px-3 mt-3"
                    >
                        {loading ? (
                            <div className=" flex w-full justify-center">
                                <ThreeDots
                                    visible={true}
                                    height="21"
                                    width="50"
                                    color="#ffffff"
                                    radius="9"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            </div>
                        ) : (
                            <div className="font-semibold">Register</div>
                        )}
                    </Button>
                </div>
            </Form>

            <Row className="py-3">
                <Col>
                    Already have an account? <Link to={`/login`}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterScreen;