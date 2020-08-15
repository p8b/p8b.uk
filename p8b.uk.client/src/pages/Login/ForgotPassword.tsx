import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import { postPasswordResetRequest, getIsTokenValid, ITokenAction } from "../../actions/TokenAction";
import { putTokenPasswordRest, IUserManagmentAction } from "../../actions/UserManagementAction";
import { PurifyComponent } from "p8b.core.ts/src/components/Class.Extensions";
import { Error } from "p8b.core.ts/src/components/Classes";
import { Modal } from "p8b.components.react/src/components/DataDisplay/_index";
import { PageHeader, Alert } from "p8b.components.react/src/components/Texts/_index";
import { RF } from "p8b.components.react/src/components/PureElements/_index";
import { Input } from "p8b.components.react/src/components/Inputs/_index";
import { Button } from "p8b.components.react/src/components/Buttons/_index";

class ForgotPasswordModal extends PurifyComponent<IProps> {
   myState = {
      email: "",
      password: "",
      confirmPassword: "",
      isTokenSent: false,
      isTokenValid: false,
      tokenVal: "",
      submitBtnTitle: "Reset Password",
      modalForceOn: false,
      redirectHome: false
   };
   constructor(props: IProps) {
      super(props);
      this.onSubmit = this.onSubmit.bind(this);
   }

   async componentDidMount() {
      try {
         const location = window.location.pathname.split("/");
         if (location[1].replace("/", "") == "ResetPassword"
            && location[2].replace("/", "") != null
            && location[2].replace("/", "").includes("RP-")) {
            this.myState.modalForceOn = true;
            this.myState.submitBtnTitle = "Continue";
            this.myState.tokenVal = location[2].replace("/", "");
            this.myState.isTokenSent = true;
            this.alert.List.push(new Error("0", "Press continue to reset you password"));
            this.forceUpdate();
         }
      } catch (e) {

      }
   };

   async onSubmit() {
      //Submit password reset request
      if (!this.myState.isTokenSent) {
         this.props.postPasswordResetRequest(this.myState.email,
            (result: ITokenAction) => {
               console.log(result);
               if (result.alert.List.length > 0) {
                  this.alert = result.alert;
                  this.forceUpdate();
               }
               this.myState.submitBtnTitle = "Continue",
                  this.myState.isTokenSent = true,
                  this.alert.List.push(
                     new Error("0", "The Link to reset your password was sent to your email. Please check your Spam folder.")
                  );
               this.forceUpdate();
            }).bind(this);
         return;
      }
      //Check token code
      if (this.myState.isTokenSent && !this.myState.isTokenValid) {
         this.props.getIsTokenValid(this.myState.tokenVal,
            ((result: ITokenAction) => {
               if (result.alert.List.length > 0) {
                  this.myState.submitBtnTitle = "Try Again";
                  this.myState.isTokenValid = false;
                  this.alert = result.alert;
                  this.forceUpdate();
                  return;
               }
               this.myState.submitBtnTitle = "Change Password";
               this.myState.isTokenValid = true;
               this.alert.List = [(new Error("0", "Toke accepted."))];
               this.forceUpdate();
            }));
      };
      //Change Password
      if (this.myState.isTokenSent && this.myState.isTokenValid) {
         if (this.myState.password !== this.myState.confirmPassword) {
            this.alert.List = [(new Error("0", "Passwords must match."))];
            this.forceUpdate();
            return;
         }

         await this.props.putTokenPasswordRest(
            this.myState.tokenVal,
            this.myState.password,
            ((result: IUserManagmentAction) => {
               if (result.alert.List.length > 0) {
                  this.alert = result.alert;
                  this.myState.redirectHome = false;
                  this.forceUpdate();
                  return;
               }
               this.myState.redirectHome = true;
               this.forceUpdate();
               return;
            }).bind(this));
      }

   }

   render() {
      if (this.myState.redirectHome) return <Redirect to="/" />;

      if (this.myState.email == null || this.myState.email === "")
         this.myState.email = this.props.email;
      return (
         <Modal className="col-12 col-sm-10 col-md-9 col-lg-7"
            bodyClassName="p-3"
            isOpen={this.props.isOpen}
            onClose={this.props.onCancel}>
            <PageHeader title="Forgot Password?" />

            {!this.myState.isTokenSent &&
               <RF>
                  <p>Don"t worry, we will email you a link to reset you password.</p>
                  <Input lblText="Email *" type="email" keyVal="email"
                     bindedValue={this.props.email}
                     onChange={i => this.myState.email = i.target.value}
                  />
               </RF>
            }
            {this.myState.isTokenSent && !this.myState.isTokenValid &&
               < RF >
                  <div className="row col-auto"><a children="Copy the code from you email here." />
                     <h6 className="underline ml-2" children="Request new Code"
                        onClick={() => { this.myState.isTokenSent = false; this.onSubmit(); }} />
                  </div>
                  <Input lblText="Enter Password Reset Code *" type="text" keyVal="token"
                     bindedValue={this.myState.tokenVal}
                     onChange={i => this.myState.tokenVal = i.target.value}
                  />
               </RF>
            }
            {this.myState.isTokenSent && this.myState.isTokenValid &&
               <RF>
                  <p>You can now reset you password.</p>
                  <Input lblText="New Password *" type="password" keyVal="password"
                     bindedValue={this.myState.password}
                     onChange={i => this.myState.password = i.target.value}
                  />
                  <Input lblText="Confirm Password *" type="password" keyVal="confirmPassword"
                     bindedValue={this.myState.confirmPassword}
                     onChange={i => this.myState.confirmPassword = i.target.value}
                  />
               </RF>
            }

            <Alert alert={this.alert}
               className="col-12 mb-2"
               onClosed={() => this.reRender(() => this.alert.List = [])}
            />

            <Button children={this.myState.submitBtnTitle} className="col-6 mt-2 btn-lg  btn-green"
               onClick={this.onSubmit} />

            <Button children="Cancel" className="col-6 mt-2  btn-lg btn-white"
               onClick={this.props.onCancel} />
         </Modal >
      );
   }
}
export default connect(
   (state: any) => {
      return {
      };
   },
   dispatch => bindActionCreators({
      postPasswordResetRequest,
      getIsTokenValid,
      putTokenPasswordRest
   }, dispatch)
)(ForgotPasswordModal);
declare type IProps = {
   email: string,
   isOpen: boolean,
   onCancel: () => void;
   postPasswordResetRequest: typeof postPasswordResetRequest,
   getIsTokenValid: typeof getIsTokenValid,
   putTokenPasswordRest: typeof putTokenPasswordRest,
};