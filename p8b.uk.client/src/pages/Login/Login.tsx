import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";

import ForgotPassword from "./ForgotPassword";
import NewCustomer from "./NewCustomer";
import Container from "../../components/Container";
import { LoginInfo, User, ExternalLoginInfo } from "../../core/apiClass";
import { AlertTypes, CommonRegex } from "../../core/constant.Variables";
import { Error, AlertObj } from "../../core/appClasses";
import { Row } from "../../components/PureElements/Row";
import { PageHeader } from "../../components/Texts/PageHeader";
import { Input } from "../../components/Inputs/Input";
import { CheckBox } from "../../components/Inputs/CheckBox";
import { Alert } from "../../components/Texts/Alert";
import { Button } from "../../components/Buttons/Button";
import GoogleLogin from "../../components/Buttons/GoogleLogin";
import FacebookLogin from "../../components/Buttons/FacebookLogin";
import GitHubLogin from "../../components/Buttons/GithubLogin";
import { useLogin, useExternalLogin } from "../../customHooks/apiCallers/authentication/postLogin";
import { AuthContext } from "../../core/authenticationContext";


const Login = (props: any) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [loginInfo, setLoginInfo] = useState(new LoginInfo());
   const [newUser, setNewUser] = useState(new User());
   const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(false);
   const [newCustomerModalIsOpen, setNewCustomerModalIsOpen] = useState(false);
   const auth = useContext(AuthContext);
   const login = async () => {
      setAlert(new AlertObj([new Error("Working", "Please Wait.")], AlertTypes.Warning));
      const result = await useLogin(loginInfo);
      if (result.alert.List.length > 0) {
         setAlert(result.alert);
      } else if (result.isAuthenticated) {
         auth.setState({ isAuthenticated: result.isAuthenticated, user: result.user });
      }
   };

   const externalLogin = async (info: ExternalLoginInfo) => {

      info.rememberMe = loginInfo.rememberMe;
      const result = await useExternalLogin(info);
      if (result.alert.List.length > 0) {
         //auth.setState({ isAuthenticated: true, user: result.user });
         setAlert(result.alert);
      }
      /// pass the state user info to create new customer
      if (!result.isAuthenticated) {
         setNewCustomerModalIsOpen(true);
         setNewUser(result.user);
         setAlert(new AlertObj());
      } else if (result.isAuthenticated) {
         auth.setState({ isAuthenticated: result.isAuthenticated, user: result.user });
      }
   };

   const externalLoginWait = () => {
      setAlert(new AlertObj([new Error("Working", "Please Wait...")], AlertTypes.Warning));
   };
   const externalLoginFailed = (err: string) => {
      setAlert(new AlertObj([new Error(Math.random(), err)], AlertTypes.Error));
   };
   /// If user is authenticated then redirect the user to home page
   if (auth.state.isAuthenticated) {
      try {
         return (<Redirect to={props.location.state?.fromPath || "/"} />);
      } catch (e) {
         return (<Redirect to="/" />);
      }
   }
   return (
      <Container className="custom-container">
         <Row className="justify-content-sm-center">
            <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4">
               <PageHeader title="Login" className="pt-0" />

               <Input lblText="Email" type="email" keyVal="email"
                  value={loginInfo.email}
                  validationPattern={CommonRegex.Email}
                  showDanger={alert.checkExist("email")}
                  onChange={i => setLoginInfo({ ...loginInfo, email: i.target.value })}
               />

               <Input lblText="Password" type="password" keyVal="password"
                  enterPressed={login}
                  value={loginInfo.password}
                  showDanger={alert.checkExist("password")}
                  onChange={i => setLoginInfo({ ...loginInfo, password: i.target.value })}
               />

               <div className="mt-3 mb-3 d-inline">
                  <CheckBox lblValue="Remember Me" className="col-6 color-style-checked" keyVal="rememberMe"
                     onChange={checked => setLoginInfo({ ...loginInfo, rememberMe: checked })}
                  />
                  <a onClick={() => setForgotPasswordModalIsOpen(true)}
                     className="text-right col-6 float-right text-underline"
                     children="Forgot Password?"
                  />

               </div>

               <Alert alert={alert} className="col-12" onClosed={() => setAlert(new AlertObj())} />

               <Button children="Login" className="col-12 btn-lg btn-green mt-2" onClick={login} />
               <GoogleLogin clientId="721733196080-9i5jspufdn9ffo26iul1g3g177iv8e0m.apps.googleusercontent.com"
                  children="Sign in with Google"
                  className="btn-lg btn-g col-12 mt-2"
                  redirectURI="https://localhost:8080/Login"
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={() => setAlert(new AlertObj())}
               />
               <FacebookLogin clientId="1237220039954343"
                  children="Login with Facebook"
                  className="btn-lg btn-fb col-12 mt-2"
                  redirectURI="https://localhost:8080/Login"
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={() => setAlert(new AlertObj())}
               />
               <GitHubLogin clientId="c2c5dd44f9568e1442fd"
                  children="Login with Github"
                  className="btn-lg btn-git col-12 mt-2"
                  onSuccess={externalLogin}
                  onFailure={externalLoginFailed}
                  onClick={externalLoginWait}
                  onClosedWithoutAction={() => setAlert(new AlertObj())}
               />
               <Button children="New User" className="btn-lg btn-navy col-12 mt-2"
                  onClick={() => {
                     setNewUser({ ...newUser, email: loginInfo.email });
                     setNewCustomerModalIsOpen((prev) => !prev);
                  }}
               />

            </div>
         </Row>

         {/***** Modals ****/}
         <ForgotPassword isOpen={forgotPasswordModalIsOpen}
            onCancel={() => setForgotPasswordModalIsOpen(false)}
            email={loginInfo.email || ""}
         />
         <NewCustomer isOpen={newCustomerModalIsOpen}
            onCancel={() => {
               setNewCustomerModalIsOpen(false);
               setNewUser(new User());
            }}
            newUser={newUser}
         />
      </Container >
   );
};

export default Login;