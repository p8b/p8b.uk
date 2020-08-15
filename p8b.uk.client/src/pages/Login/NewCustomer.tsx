import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { postCustomer, IUserManagmentAction } from "../../actions/UserManagementAction";
import { Redirect } from "react-router-dom";
import { IReduxStoreState } from "../../reducers";
import { PurifyComponent } from "p8b.core.ts/src/components/Class.Extensions";
import { User, Error } from "p8b.core.ts/src/components/Classes";
import { AlertTypes, RegistrationTypes, CommonRegex } from "p8b.core.ts/src/components/Constant.Variables";
import { enumToArray } from "p8b.core.ts/src/components/Functions";
import { Modal } from "p8b.components.react/src/components/DataDisplay/_index";
import { PageHeader, Alert } from "p8b.components.react/src/components/Texts/_index";
import { Row, RF } from "p8b.components.react/src/components/PureElements/_index";
import { Input, CheckBox } from "p8b.components.react/src/components/Inputs/_index";
import { Button } from "p8b.components.react/src/components/Buttons/_index";

class NewCustomer extends PurifyComponent<IProps> {
   myState = {
      user: new User(),
      termsAndCondition: false,
      confirmPassword: "",
      redirectToMain: false,
      optionalPassword: false

   };
   constructor(props: IProps) {
      super(props);
      this.createNewCustomer = this.createNewCustomer.bind(this);
   }
   async createNewCustomer() {
      this.alert.List = [];
      this.alert.Type = AlertTypes.Error;

      if ((this.myState.user.firstName || "") === "")
         this.alert.List.push(new Error("firstName", "Name is required"));
      if ((this.myState.user.surname || "") === "")
         this.alert.List.push(new Error("surname", "Surname is required"));
      if ((this.myState.user?.tempPassword || "") === "" && !this.myState.optionalPassword)
         this.alert.List.push(new Error("passwordHash", "Password is required"));
      if ((this.myState.user.tempPassword || "") !== this.myState.confirmPassword && !this.myState.optionalPassword)
         this.alert.List.push(new Error("passwordHash", "Passwords must match."));
      if (!this.myState.termsAndCondition)
         this.alert.List.push(new Error("0", "You must agree to terms and conditions"));

      if (this.alert.List.length > 0)
         this.reRender();
      else
         this.props.postCustomer(this.myState.user,
            ((result: IUserManagmentAction) => {
               console.log(result);
               if (result.alert.List.length > 0)
                  this.reRender(() => {
                     this.alert = result.alert;
                     this.myState.redirectToMain = false;
                  });
               else
                  this.reRender(() => this.myState.redirectToMain = true);
            }).bind(this)
         );
   }

   //validation(inputName: string = "") {
   //   return this.alert.List.find(t => t.key!.toLowerCase() == inputName.toLowerCase()) ?
   //      "danger" :
   //      "default";
   //}
   getRegistrationType() {
      let regType = this.myState.user.registrationMethod?.type;
      if (regType != null && regType != RegistrationTypes.Application) {
         let typeList = enumToArray(RegistrationTypes);
         this.myState.optionalPassword = true;
         return `(Linked to ${typeList.find(i => i.id == regType)?.name} account)`;
      }
      return "";
   }
   render() {
      if (this.myState.redirectToMain) return <Redirect to="/" />;
      if (this.props.newUser != null) this.myState.user = this.props.newUser;

      return (
         <Modal isOpen={this.props.isOpen} onClose={this.props.onCancel}>
            <PageHeader title={<RF>New Customer <p className="small-text" children={this.getRegistrationType()} /></RF>} />
            <Row>
               <Input lblText="Name *" type="text" className="col-6  " keyVal="name"
                  bindedValue={this.myState.user.firstName}
                  showDanger={this.alert.checkExist("firstname")}
                  onChange={i => this.myState.user.firstName = i.target.value}
               />

               <Input lblText="Surname *" type="text" className="col-6" keyVal="surname"
                  showDanger={this.alert.checkExist("surname")}
                  bindedValue={this.myState.user.surname}
                  onChange={i => this.myState.user.surname = i.target.value}
               />
               <Input lblText="Phone Number" type="text" className="col-6" keyVal="phoneNumber"
                  showDanger={this.alert.checkExist("phoneNumber")}
                  pattern={CommonRegex.UkNumber}
                  onChange={i => this.myState.user.phoneNumber = i.target.value}
               />


               <Input lblText="Email *" type="email" className="col-6" keyVal="email1"
                  showDanger={this.alert.checkExist("email")}
                  bindedValue={this.myState.user.email}
                  pattern={CommonRegex.Email}
                  onChange={i => this.myState.user.email = i.target.value}
               />

               <Input lblText={`Password ${this.myState.optionalPassword ? "(Optional)" : "*"}`}
                  type="password"
                  className="col-6" keyVal="password"
                  showDanger={this.alert.checkExist("passwordhash")}
                  onChange={i => this.myState.user.tempPassword = i.target.value}
               />

               <Input lblText={`Confirm Password ${this.myState.optionalPassword ? "(Optional)" : "*"}`}
                  type="password"
                  className="col-6" keyVal="confirmPassword"
                  showDanger={this.alert.checkExist("passwordhash")}
                  onChange={i => this.myState.confirmPassword = i.target.value}
               />
               <div className="col-12">
                  <CheckBox keyVal="tAndc" className="mt-1 color-style"
                     onChange={checked => this.myState.termsAndCondition = checked}
                     lblValue={<RF>I Agree to <a className="hover-gray text-underline" href=" /termsandconditions" target="_blank">terms and conditions</a>.</RF>} />
               </div>
               <div className="col-12 mt-2">
                  <Alert alert={this.alert} className="col-12 mb-1"
                     onClosed={this.resetAlert}
                  />
                  <Button children="Submit" className="col-6 mt-2 btn-green"
                     onClick={this.createNewCustomer} />
                  <Button children="Cancel" className="col-6 mt-2 btn-red"
                     onClick={() => this.reRender(() => { this.alert.List = []; this.props.onCancel(); })} />
               </div>
            </Row>
         </Modal >
      );
   }
}

/// Redux Connection before exporting the component
export default connect(
   (state: IReduxStoreState) => { return {}; },
   dispatch => bindActionCreators({ postCustomer }, dispatch)
)(NewCustomer);

declare type IProps = {
   postCustomer: typeof postCustomer,
   isOpen: boolean,
   newUser: User,
   onCancel: () => void;
};