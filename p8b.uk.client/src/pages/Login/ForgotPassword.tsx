import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Error, AlertObj } from "../../core/appClasses";
import Modal from "../../components/DataDisplay/Modal";
import { PageHeader } from "../../components/Texts/PageHeader";
import { Input } from "../../components/Inputs/Input";
import { Alert } from "../../components/Texts/Alert";
import { Button } from "../../components/Buttons/Button";
import { AlertTypes } from "../../core/constant.Variables";
import { useIsTokenValid } from "../../customHooks/apiCallers/token/getIsTokenValid";
import { useTokenPasswordRest } from "../../customHooks/apiCallers/user/putTokenPasswordRest";
import { usePasswordResetRequest } from "../../customHooks/apiCallers/user/postPasswordResetRequest";

const ForgotPasswordModal = (props: IProps) => {
   const [alert, setAlert] = useState(new AlertObj());
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [isTokenSent, setIsTokenSent] = useState(false);
   const [isTokenValid, setIsTokenValid] = useState(false);
   const [token, setToken] = useState("");
   const [submitBtnTitle, setSubmitBtnTitle] = useState("Reset Password");
   //const [modalForceOn, setModalForceOn] = useState(false);
   const [redirectHome, setRedirectHome] = useState(false);

   useEffect(() => {
      try {
         const location = window.location.pathname.split("/");
         if (location[1].replace("/", "") == "ResetPassword"
            && location[2].replace("/", "") != null
            && location[2].replace("/", "").includes("RP-")) {
            //setModalForceOn(true);
            setSubmitBtnTitle("Continue");
            setToken(location[2].replace("/", ""));
            setIsTokenSent(true);
            setAlert(new AlertObj([new Error("0", "Press continue to reset you password")], AlertTypes.Success));
         }
      } catch (e) {

      }
   }, []);

   const onSubmit = async () => {
      //Submit password reset request
      if (!isTokenSent) {
         const [resultAlert, resultIsTokenSent] = await usePasswordResetRequest(email);
         if (!resultIsTokenSent && (resultAlert as AlertObj).List.length > 0)
            setAlert(resultAlert as AlertObj);

         setSubmitBtnTitle("Continue");
         setIsTokenSent(true);
         setAlert(new AlertObj([new Error("0", "The Link to reset your password was sent to your email. Please check your Spam folder.")]
            , AlertTypes.Success));
         return;
      }
      //Check token code
      if (isTokenSent && !isTokenValid) {
         const [resultAlert, resultIsTokenValid] = await useIsTokenValid(token);

         if (!resultIsTokenValid && (resultAlert as AlertObj).List.length > 0) {
            setSubmitBtnTitle("Try Again");
            setIsTokenValid(false);
            setAlert(resultAlert as AlertObj);
            return;
         }
         setSubmitBtnTitle("Change Password");
         setIsTokenValid(true);
         setAlert(new AlertObj([new Error("0", "Toke accepted.")], AlertTypes.Success));
         return;
      };

      //Change Password
      if (isTokenSent && isTokenValid) {
         if (password !== confirmPassword) {
            setAlert(new AlertObj([new Error("0", "Passwords must match.")], AlertTypes.Error));
            return;
         }

         const result = await useTokenPasswordRest(token, password);
         if (result.List.length > 0) {
            setAlert(result);
            setRedirectHome(false);
            return;
         }
         setRedirectHome(true);
         return;
      }
   };

   if (redirectHome) return <Redirect to="/" />;

   if (email) setEmail(props.email);

   return (
      <Modal className="col-12 col-sm-10 col-md-9 col-lg-7"
         bodyClassName="p-3"
         isOpen={props.isOpen}
         onClose={props.onCancel}>
         <PageHeader title="Forgot Password?" />

         {!isTokenSent &&
            <>
               <p>Don't worry, we will email you a link to reset you password.</p>
               <Input lblText="Email *" type="email" keyVal="email"
                  value={email}
                  onChange={i => setEmail(i.target.value)}
               />
            </>
         }
         {isTokenSent && !isTokenValid &&
            <>
               <div className="row col-auto"><a children="Copy the code from you email here." />
                  <h6 className="underline ml-2" children="Request new Code"
                     onClick={() => { setIsTokenSent(false); onSubmit(); }} />
               </div>
               <Input lblText="Enter Password Reset Code *" type="text" keyVal="token"
                  value={token}
                  onChange={i => setToken(i.target.value)}
               />
            </>
         }
         {isTokenSent && isTokenValid &&
            <>
               <p>You can now reset you password.</p>
               <Input lblText="New Password *" type="password" keyVal="password"
                  value={password}
                  onChange={i => setPassword(i.target.value)}
               />
               <Input lblText="Confirm Password *" type="password" keyVal="confirmPassword"
                  value={confirmPassword}
                  onChange={i => setConfirmPassword(i.target.value)}
               />
            </>
         }

         <Alert alert={alert}
            className="col-12 mb-2"
            onClosed={() => setAlert(new AlertObj())}
         />

         <Button children={submitBtnTitle} className="col-6 mt-2 btn-lg  btn-green"
            onClick={() => onSubmit} />

         <Button children="Cancel" className="col-6 mt-2  btn-lg btn-white"
            onClick={props.onCancel} />
      </Modal >
   );
};
declare type IProps = {
   email: string,
   isOpen: boolean,
   onCancel: () => void;
};

export default ForgotPasswordModal;