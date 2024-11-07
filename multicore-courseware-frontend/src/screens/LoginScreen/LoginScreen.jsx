import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { ThreeDots } from "react-loader-spinner";
import { login } from '../../features/actions/authActions';
import { resetRegistered } from "../../features/slices/authSlices";

const LoginScreen = () => {

    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");


    const dispatch = useDispatch();

    const { isAuthenticated, user, loading, registered } = useSelector(
        state => state.auth
    );

    useEffect(() => {
        if (registered) dispatch(resetRegistered());
    }, [registered]);

    const submitHandler = e => {
        e.preventDefault();

        try {
            dispatch(login({ mobile, password }));
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    const navigate = useNavigate();
    useEffect(() => {
        // Redirect if isAuthenticated is true
        if (isAuthenticated) {
            navigate('/');
            toast.success("Logged In Successfully!!");
        }
    }, [isAuthenticated, navigate]);


    return (
        <FormContainer>
            <h1 className=" text-center text-blue-600">Log In</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="mobile">
                    <Form.Label className=" font-semibold">Mobile No.</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="Enter mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label className=" font-semibold">Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <div className=" w-full flex justify-center items-center">
                    <Button
                        disabled={loading}
                        type="submit"
                        variant="primary"
                        className="mt-3 w-[50%] py-2 px-2"
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
                            <div
                                className="font-semibold"
                            >
                                Log In
                            </div>
                        )}
                    </Button>
                </div>
            </Form>

            <Row className="py-3">
                <Col>
                    New Customer? <Link to="/register">Register</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default LoginScreen;