import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "./core/CustomRoute";
import ProtectedRoute from "./core/ProtectedRoute";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import Footer from "./components/Footer";
import { Loading } from "./components/Loading";
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const PageNotFound = lazy(() => import("./pages/Error/PageNotFound"));
const App = () => {
   return (
      <BrowserRouter>
         <NavMenu />
         <Suspense fallback={<Loading />}>
            <Switch>
               {/***** Public Routes  ****/}
               <CustomRoute exact path="/" Render={(props: any) => <Home {...props} />} />
               <CustomRoute exact path="/Login" Render={(props: any) => <Login {...props} />} />
               <CustomRoute exact path="/About" Render={(props: any) => <About {...props} />} />
               <CustomRoute exact path="/Contact" Render={(props: any) => <Contact {...props} />} />
               {/***** Protected Routes ****/}
               <ProtectedRoute exact path="/MyAccount" Render={(props: any) => <MyAccount {...props} />} />
               {/***** Other Routes ****/}
               <CustomRoute path="*" Render={(props: any) => <PageNotFound {...props} />} />
            </Switch>
         </Suspense>
         <Footer />
      </BrowserRouter>
   );
};
export default App;