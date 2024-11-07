// import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from "./component/Login.js"
// import Home from "./screens/Home.jsx"
// import Logout from "./component/Logout.js"
// import Navigation from "./component/Navigation.js"
// import EnrollmentScreen from './screens/EnrollmentScreen/EnrollmentScreen.jsx';
// import PaymentScreen from './screens/PaymentScreen/PaymentScreen.jsx';
// import CourseLandingScreen from './screens/CourseLandingScreen/CourseLandingScreen.jsx';
// import SignUpScreen from './screens/SignUpScreen/SignUpScreen.jsx';
// import About from './screens/About/About.jsx';
// import PrivateRoute from './component/Routing/PrivateRoute.jsx';
// import LoginScreen from './screens/LoginScreen/LoginScreen.jsx';
// import RegisterScreen from './screens/RegisterScreen/RegisterScreen.jsx';

// function App() {
//   return (
//     <BrowserRouter>
//       <Navigation />
//       <Routes>
//         <Route path="/login-dep" element={<Login />} />
//         <Route path="/signup-dep" element={<SignUpScreen />} />
//         <Route path="/login" element={<LoginScreen />} />
//         <Route path="/signup" element={<RegisterScreen />} />

//         {/* <Route exact path='/' element={<PrivateRoute />}>
//           <Route exact path="/logout" element={<Logout />} />
//         </Route>

//         <Route exact path='/' element={<PrivateRoute />}>
//           <Route exact path='/' element={<Home />} />
//         </Route>

//         <Route exact path='/' element={<PrivateRoute />}>
//           <Route exact path="/enrollment/:courseId" element={<EnrollmentScreen />} />
//         </Route>

//         <Route exact path='/' element={<PrivateRoute />}>
//           <Route exact path="/payment/:courseId" element={<PaymentScreen />} />
//         </Route>

//         <Route exact path='/' element={<PrivateRoute />}>
//           <Route path="/course/:courseId" element={<CourseLandingScreen />} />
//         </Route> */}

//         <Route element={<PrivateRoute />}>
//           <Route exact path="/logout" element={<Logout />} />
// <Route exact path='/' element={<Home />} />
// <Route exact path="/enrollment/:courseId" element={<EnrollmentScreen />} />
// <Route exact path="/payment/:courseId" element={<PaymentScreen />} />
// <Route path="/course/:courseId" element={<CourseLandingScreen />} />
//           <Route path="/about" element={<About />} />
//         </Route>


//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const [isHomePage, setIsHomePage] = useState(false);

  // Custom hook to listen to route changes
  const useIsHomePage = () => {
    const location = useLocation();
    useEffect(() => {
      setIsHomePage(
        location.pathname === "/" || location.pathname === "/about"
      );
    }, [location]);
  };

  // Call custom hook
  useIsHomePage();

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="w-10/12 mx-auto">
        <Outlet />
      </div>
      {isHomePage && <Footer />}
    </>
  );
};

export default App;