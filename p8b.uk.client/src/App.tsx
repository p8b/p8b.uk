import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import CustomRoute from "./core/customRoute";
//import ProtectedRoute from "./core/protectedRoute";

// Main Components such as pages, navbar, footer
import NavMenu from "./components/NavMenu/NavMenu";
import Footer from "./components/Footer";
import { Loading } from "./components/Loading";
import Container from "./components/Container";
import GlobalContext from "./core/authenticationContext";
const Home = lazy(() => import("./pages/Home/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const MyAccount = lazy(() => import("./pages/MyAccount/MyAccount"));
const PageNotFound = lazy(() => import("./pages/Error/PageNotFound"));
const App = () => {
   return (
      <BrowserRouter>
         <GlobalContext>
            <NavMenu />
            <Container id="mainContainer" className="custom-container p-0" extendBottom extendTop>
               <Suspense fallback={<Loading />}>
                  <Switch>
                     {/***** Public Routes  ****/}
                     <CustomRoute exact path="/" Render={(props: any) => <Home {...props} />} />
                     <CustomRoute exact path="/Login" Render={(props: any) => <Login {...props} />} />
                     <CustomRoute exact path="/About" Render={(props: React.ComponentProps<any>) => <About {...props} />} />
                     <CustomRoute exact path="/Contact" Render={(props: React.ComponentProps<any>) => <Contact {...props} />} />
                     {/***** Protected Routes ****/}
                     <CustomRoute AuthRequired exact path="/MyAccount" Render={(props: React.ComponentProps<any>) => <MyAccount {...props} />} />
                     {/***** Other Routes ****/}
                     <CustomRoute path="*" Render={(props: React.ComponentProps<any>) => <PageNotFound {...props} />} />
                  </Switch>
               </Suspense>
            </Container>
            <Footer />
         </GlobalContext>
      </BrowserRouter>
   );
};
export default App;