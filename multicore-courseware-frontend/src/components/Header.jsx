import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/multicore.png";
// import Avatar from "react-avatar";
import { logout } from '../features/actions/authActions'

const Header = () => {
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const logoutHandler = async () => {
        try {
            dispatch(logout());
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header className="">
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand className="font-sans font-bold">
                            <div className="flex gap-x-2 text-3xl justify-center items-center">
                                <img width={50} src={logo} alt="" />
                                MultiCore
                            </div>
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto d-flex flex align-items-center">
                            <div className=" flex gap-x-3">
                                <LinkContainer to="/">
                                    <Nav.Link>
                                        <div className=" text-white transition-all duration-200 rounded-md ">
                                            Home
                                        </div>
                                    </Nav.Link>
                                </LinkContainer>
                                {
                                    <LinkContainer to="/home">
                                        <Nav.Link>
                                            <div className=" text-white transition-all duration-200 rounded-md ">
                                                Courses
                                            </div>
                                        </Nav.Link>
                                    </LinkContainer>
                                }
                                <LinkContainer to="/about">
                                    <Nav.Link>
                                        <div className=" text-white transition-all duration-200 rounded-md ">
                                            About
                                        </div>
                                    </Nav.Link>
                                </LinkContainer>
                            </div>
                        </Nav>
                        <Nav className="ms-auto">
                            {user ? (
                                <>
                                    <div className="flex justify-center items-center gap-x-2">
                                        <NavDropdown title={user.first_name} id="username">
                                            <LinkContainer to="/profile">
                                                <NavDropdown.Item>Profile</NavDropdown.Item>
                                            </LinkContainer>
                                            <NavDropdown.Item onClick={logoutHandler}>
                                                Logout
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center items-center gap-x-3">
                                        <LinkContainer to="/login">
                                            <Nav.Link>
                                                <div className=" text-white transition-all duration-200 rounded-md ">
                                                    Login
                                                </div>
                                            </Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/register">
                                            <Nav.Link>
                                                <div className="py-2 text-white px-3 rounded-md bg-blue-500">
                                                    Register
                                                </div>
                                            </Nav.Link>
                                        </LinkContainer>
                                    </div>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;