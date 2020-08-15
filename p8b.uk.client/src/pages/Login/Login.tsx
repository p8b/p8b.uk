import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { postLogin, getSilentAuthentication, getLogout, IAuthenticationAction, postExternalLogin } from "../../actions/AuthenticationAction";

import { IAuthenticationReducer } from "../../reducers/AuthenticationReducer";
import { IReduxStoreState } from "../../reducers";
import ForgotPassword from "./ForgotPassword";
import NewCustomer from "./NewCustomer";
import { Container } from "../../components/Container";
import { PurifyComponent } from "p8b.core.ts/src/components/Class.Extensions";
import { LoginInfo, User, Error, ExternalLoginInfo } from "p8b.core.ts/src/components/Classes";
import { AlertTypes, CommonRegex } from "p8b.core.ts/src/components/Constant.Variables";
import { Row } from "p8b.components.react/src/components/PureElements/_index";
import { PageHeader, Alert } from "p8b.components.react/src/components/Texts/_index";
import { Input, CheckBox } from "p8b.components.react/src/components/Inputs/_index";
import { Button, GoogleLogin, FacebookLogin, GitHubLogin } from "p8b.components.react/src/components/Buttons/_index";


class Login extends PurifyComponent<IProps> {
   myState = {
      loginInfo: new LoginInfo(),
      newUser: new User(),
      forgotPasswordModalIsOpen: false,
      newCustomerModalIsOpen: false,
   };
   constructor(props: IProps) {
      super(props);
      this.login = this.login.bind(this);
      this.externalLogin = this.externalLogin.bind(this);
      this.externalLoginWait = this.externalLoginWait.bind(this);
      this.externalLoginFailed = this.externalLoginFailed.bind(this);
   }
   async componentDidMount() {
   };
   async login() {
      this.reRender(() => {
         this.alert.Type = AlertTypes.Warning;
         this.alert.List = [];
         this.alert.List.push(new Error("Working", "Please Wait."));
      });
      await this.props.postLogin(
         this.myState.loginInfo,
         (result: IAuthenticationAction) =>
            this.reRender(() => this.alert = result.alert)
      );
   }
   async externalLogin(info: ExternalLoginInfo) {
      info.rememberMe = this.myState.loginInfo.rememberMe;
      this.props.postExternalLogin(info, (state: IAuthenticationAction) => {
         if (state.alert.List.length > 0) {
            this.reRender(() => this.alert = state.alert);
         }
         else if (!state.payload.isAuthenticated) {
            /// pass the state user info to create new customer
            this.reRender(() => {
               this.alert.List = [];
               this.myState.newUser = state.payload.user;
               this.myState.newCustomerModalIsOpen = !this.myState.newCustomerModalIsOpen;
            });
         }
      });
   }
   externalLoginWait() {
      this.reRender(() => {
         this.alert.List = [new Error("Working", "Please Wait...")];
         this.alert.Type = AlertTypes.Warning;
      });
   }
   externalLoginFailed(err: string) {
      this.reRender(() => this.alert.List = [new Error(Math.random(), err)]);
   }
   render() {
      /// If user is authenticated then redirect the user to home page
      if (this.props.Authentication.isAuthenticated) {
         try {
            return (<Redirect to={this.props.location.state.fromPath || "/"} />);
         } catch (e) {
            return (<Redirect to="/" />);
         }
      }
      return (
         <Container className="custom-container" extendBottom>
            <Row className="justify-content-sm-center">
               <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4">
                  <PageHeader title="Login" className="pt-0" />

                  <Input lblText="Email" type="email" keyVal="email"
                     bindedValue={this.myState.loginInfo.email}
                     pattern={CommonRegex.Email}
                     showDanger={this.alert.checkExist("email")}
                     onChange={i => this.myState.loginInfo.email = i.target.value}
                  />

                  <Input lblText="Password" type="password" keyVal="password"
                     enterPressed={this.login}
                     bindedValue={this.myState.loginInfo.password}
                     showDanger={this.alert.checkExist("password")}
                     onChange={i => this.myState.loginInfo.password = i.target.value}
                  />

                  <div className="mt-3 mb-3 d-inline">
                     <CheckBox lblValue="Remember Me" className="col-6 color-style-checked" keyVal="rememberMe"
                        onChange={checked => this.myState.loginInfo.rememberMe = checked}
                     />
                     <a onClick={() => this.reRender(() => this.myState.forgotPasswordModalIsOpen = true)}
                        className="text-right col-6 float-right text-underline"
                        children="Forgot Password?"
                     />

                  </div>

                  <Alert alert={this.alert} className="col-12" onClosed={this.resetAlert} />

                  <Button children="Login" className="col-12 btn-lg btn-green mt-2" onClick={this.login} />
                  <GoogleLogin clientId="721733196080-9i5jspufdn9ffo26iul1g3g177iv8e0m.apps.googleusercontent.com"
                     children="Sign in with Google"
                     className="btn-lg btn-g col-12 mt-2"
                     redirectURI="https://localhost:8080/Login"
                     onSuccess={this.externalLogin}
                     onFailure={this.externalLoginFailed}
                     onClick={this.externalLoginWait}
                     onClosedWithoutAction={this.resetAlert}
                  />
                  <FacebookLogin clientId="1237220039954343"
                     children="Login with Facebook"
                     className="btn-lg btn-fb col-12 mt-2"
                     redirectURI="https://localhost:8080/Login"
                     onSuccess={this.externalLogin}
                     onFailure={this.externalLoginFailed}
                     onClick={this.externalLoginWait}
                     onClosedWithoutAction={this.resetAlert}
                  />
                  <GitHubLogin clientId="c2c5dd44f9568e1442fd"
                     children="Login with Github"
                     className="btn-lg btn-git col-12 mt-2"
                     onSuccess={this.externalLogin}
                     onFailure={this.externalLoginFailed}
                     onClick={this.externalLoginWait}
                     onClosedWithoutAction={this.resetAlert}
                  />
                  <Button children="New User" className="btn-lg btn-navy col-12 mt-2"
                     onClick={() => this.reRender(() => {
                        this.myState.newUser.email == this.myState.loginInfo.email;
                        this.myState.newCustomerModalIsOpen = !this.myState.newCustomerModalIsOpen;
                     })}
                  />

               </div>
            </Row>

            {/***** Modals ****/}
            <ForgotPassword isOpen={this.myState.forgotPasswordModalIsOpen}
               onCancel={() => this.reRender(() => this.myState.forgotPasswordModalIsOpen = false)}
               email={this.myState.loginInfo.email || ""}
            />
            <NewCustomer isOpen={this.myState.newCustomerModalIsOpen}
               onCancel={() => this.reRender(() => {
                  this.myState.newCustomerModalIsOpen = false;
                  this.myState.newUser = new User();
               })}
               newUser={this.myState.newUser}
            />
         </Container >
      );
   }
}
declare type IProps = {
   location: any,
   Authentication: IAuthenticationReducer,
   getLogout: typeof getLogout,
   postLogin: typeof postLogin,
   postExternalLogin: typeof postExternalLogin,
   getSilentAuthentication: typeof getSilentAuthentication,
};
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
      postLogin,
      getLogout,
      getSilentAuthentication,
      postExternalLogin,
   }, dispatch)
)(Login);