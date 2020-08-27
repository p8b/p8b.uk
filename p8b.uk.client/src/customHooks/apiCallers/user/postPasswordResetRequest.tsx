import { httpCaller } from "../../../core/appFunc";
import { API_URL, AlertTypes, CommonErrors } from "../../../core/constant.Variables";
import { AlertObj, Error } from "../../../core/appClasses";

export const usePasswordResetRequest = async (email: string) => {
   let alert = new AlertObj([], AlertTypes.Error);
   let isTokenSent = false;
   try {
      const response = await httpCaller.post(`${API_URL}/Token/Post/PasswordResetRequest`, email);
      switch (response?.status) {
         case 201: // Created Response
            await response.json().then(data => {
               isTokenSent = data.isTokenSent;
            });
            break;
         case 412: //Precondition Failed
         case 417: //Expectation Failed)
            await response.json().then((data: Error[]) => {
               alert.List = data;
            });
            break;
         default:
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
      if (response == null)
         alert.List.push(CommonErrors.BadServerConnection);
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }

   return [alert, isTokenSent];
};
