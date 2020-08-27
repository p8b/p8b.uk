import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { User } from "../../core/apiClass";
import { AlertTypes, RegistrationTypes, CommonRegex } from "../../core/constant.Variables";
import { Error, AlertObj } from "../../core/appClasses";
import { enumToArray } from "../../core/appFunc";
import { PageHeader } from "../../components/Texts/PageHeader";
import { Row } from "../../components/PureElements/Row";
import { Input } from "../../components/Inputs/Input";
import { CheckBox } from "../../components/Inputs/CheckBox";
import { Alert } from "../../components/Texts/Alert";
import { Button } from "../../components/Buttons/Button";
import Modal from "../../components/DataDisplay/Modal";
import { useCreateCustomer } from "../../customHooks/apiCallers/user/postUser";

const NewCustomer = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [user, setUser] = useState(new User());
   const [termsAndCondition, setTermsAndCondition] = useState(false);
   const [confirmPassword, setConfirmPassword] = useState("");
   const [redirectToMain, setRedirectToMain] = useState(false);
   let optionalPassword = false;

   const createNewCustomer = async () => {
      let errors = [];
      if ((user.firstName || "") === "")
         errors.push(new Error("firstName", "Name is required"));
      if ((user.surname || "") === "")
         errors.push(new Error("surname", "Surname is required"));
      if ((user?.tempPassword || "") === "" && !optionalPassword)
         errors.push(new Error("passwordHash", "Password is required"));
      if ((user.tempPassword || "") !== confirmPassword && !optionalPassword)
         errors.push(new Error("passwordHash", "Passwords must match."));
      if (!termsAndCondition)
         errors.push(new Error("0", "You must agree to terms and conditions"));

      if (errors.length > 0)
         setAlert(new AlertObj(errors, AlertTypes.Error));
      else {
         const result = await useCreateCustomer(user);
         if (result.List.length > 0)
            setAlert(result);
         else
            setRedirectToMain(true);
      }
   };

   const getRegistrationType = () => {
      let regType = user.registrationMethod?.type;
      if (regType != null && regType != RegistrationTypes.Application) {
         let typeList = enumToArray(RegistrationTypes);
         optionalPassword = true;
         return `(Linked to ${typeList.find(i => i.id == regType)?.name} account)`;
      }
      return "";
   };

   if (redirectToMain) return <Redirect to="/" />;
   useEffect(() => {
      if (props.newUser !== null) setUser(props.newUser);
   }, [props.newUser]);

   return (
      <Modal isOpen={props.isOpen} onClose={props.onCancel}>
         <PageHeader title={<>New Customer <p className="small-text"
            children={getRegistrationType()} /></>} />
         <Row>
            <Input lblText="Name *" type="text" className="col-6" keyVal="name"
               value={user.firstName}
               showDanger={alert.checkExist("firstname")}
               onChange={i => setUser({ ...user, firstName: i.target.value })}
            />

            <Input lblText="Surname *" type="text" className="col-6" keyVal="surname"
               showDanger={alert.checkExist("surname")}
               value={user.surname}
               onChange={i => setUser({ ...user, surname: i.target.value })}
            />
            <Input lblText="Phone Number" type="text" className="col-6" keyVal="phoneNumber"
               showDanger={alert.checkExist("phoneNumber")}
               validationPattern={CommonRegex.UkNumber}
               onChange={i => setUser({ ...user, phoneNumber: i.target.value })}
            />

            <Input lblText="Email *" type="email" className="col-6" keyVal="email1"
               showDanger={alert.checkExist("email")}
               value={user.email}
               validationPattern={CommonRegex.Email}
               onChange={i => setUser({ ...user, email: i.target.value })}
            />

            <Input lblText={`Password ${optionalPassword ? "(Optional)" : "*"}`}
               type="password"
               className="col-6" keyVal="password"
               showDanger={alert.checkExist("passwordhash")}
               onChange={i => setUser({ ...user, tempPassword: i.target.value })}
            />

            <Input lblText={`Confirm Password ${optionalPassword ? "(Optional)" : "*"}`}
               type="password"
               className="col-6" keyVal="confirmPassword"
               showDanger={alert.checkExist("passwordhash")}
               onChange={i => setConfirmPassword(i.target.value)}
            />
            <div className="col-12">
               <CheckBox keyVal="tAndc" className="mt-1 color-style"
                  onChange={checked => setTermsAndCondition(checked)}
                  lblValue={<>I Agree to <a className="hover-gray text-underline" href=" /termsandconditions" target="_blank">terms and conditions</a>.</>} />
            </div>
            <div className="col-12 mt-2">
               <Alert alert={alert} className="col-12 mb-1"
                  onClosed={() => setAlert(new AlertObj())}
               />
               <Button children="Submit" className="col-6 mt-2 btn-green"
                  onClick={createNewCustomer} />
               <Button children="Cancel" className="col-6 mt-2 btn-red"
                  onClick={() => { setAlert(new AlertObj()); props.onCancel(); }} />
            </div>
         </Row>
      </Modal >
   );
};

type IProps = {
   isOpen: boolean,
   newUser: User,
   onCancel: () => void;
};

export default NewCustomer;