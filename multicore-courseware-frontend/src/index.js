// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { store, persistor } from './app/store'
// import { PersistGate } from 'redux-persist/integration/react';
// import { Provider } from 'react-redux'

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
// <React.StrictMode>
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>,
// </React.StrictMode>,
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { store, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'

import LoginScreen from './screens/LoginScreen/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen.jsx';
import EnrollmentScreen from './screens/EnrollmentScreen/EnrollmentScreen.jsx';
import PaymentScreen from './screens/PaymentScreen/PaymentScreen.jsx';
import CourseLandingScreen from './screens/CourseLandingScreen/CourseLandingScreen.jsx';
import About from './screens/About/About.jsx';
import LandingPage from "./screens/LandingPage/LandingPage.jsx";
import HomeScreen from "./screens/HomeScreen/HomeScreen.jsx";
// import ProfileScreen from "./screens/ProfileScreen/ProfileScreen.jsx";
import CoursePage from "./screens/CoursePage/CoursePage.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';




const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<App />}>

      <Route index={true} path="/" element={<LandingPage></LandingPage>} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/home" element={<HomeScreen />} />
        {/* <Route path="/profile" element={<ProfileScreen />} /> */}
        {/* <Route path="/:id" element={<CoursePage></CoursePage>}></Route> */}
        <Route exact path="/enrollment/:courseId" element={<EnrollmentScreen />} />
        <Route exact path="/payment/:courseId" element={<PaymentScreen />} />
        <Route path="/course/:courseId" element={<CourseLandingScreen />} />
      </Route>

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>,
  </React.StrictMode>,
);
