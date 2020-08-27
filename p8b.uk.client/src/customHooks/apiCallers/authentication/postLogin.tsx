import { ExternalLoginInfo, User, LoginInfo } from "../../../core/apiClass";
import { AlertObj, Error } from "../../../core/appClasses";
import { AlertTypes, API_URL, CommonErrors } from "../../../core/constant.Variables";
import { httpCaller } from "../../../core/appFunc";

export const useExternalLogin = async (externalLoginInfo = new ExternalLoginInfo()) => {
   let user = new User();
   let isAuthenticated = false;
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.post(`${API_URL}/Authentication/Post/ExternalLogin`, externalLoginInfo);
      switch (response?.status) {
         case 200: // Ok
            await response.json().then((data: User) => {
               user = data;
               isAuthenticated = true;
            });
            break;
         case 204: // No Content
            break;
         case 206: // Partial Content
            await response.json().then((data: User) => {
               user = new User(data);
               // alert.Type = AlertTypes.Success;
               //alert.List.push(new Error("newUser", "Please continue registration"));
            });
            break;
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         case 400: // Bad Request (could be that anti-forgery is invalid)
            await httpCaller.get(`${API_URL}/Authentication/GetAntiforgeryToken`);
            alert.Type = AlertTypes.Warning;
            alert.List.push(CommonErrors.TryAgain);
            break;
         default:
            if (response == null) {
               alert.List.push(CommonErrors.BadServerConnection);
               break;
            }
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, user, isAuthenticated };
};

export const useLogin = async (userInfo: LoginInfo) => {
   let user = new User();
   let isAuthenticated = false;
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.post(`${API_URL}/authentication/Login`, userInfo);
      switch (response?.status) {
         case 200: // Ok
            await response.json().then((data: User) => {
               user = data;
               isAuthenticated = true;
            });
            break;
         case 400: //Bad Response
         case 401: //Unauthorized
         case 417: //ExpectationFailed
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         case 400: // Bad Request (could be that anti-forgery is invalid)
            await httpCaller.get(`${API_URL}/Authentication/GetAntiforgeryToken`);
            alert.Type = AlertTypes.Warning;
            alert.List.push(CommonErrors.TryAgain);
            break;
         default:
            if (response == null) {
               alert.List.push(CommonErrors.BadServerConnection);
               break;
            }
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return { alert, user, isAuthenticated };
};