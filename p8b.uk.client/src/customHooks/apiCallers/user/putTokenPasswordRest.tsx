import { AlertObj, Error } from "../../../core/appClasses";
import { AlertTypes, API_URL, CommonErrors } from "../../../core/constant.Variables";
import { httpCaller } from "../../../core/appFunc";
import { User } from "../../../core/apiClass";

export const useTokenPasswordRest = async (token: string, password: string) => {
   let alert = new AlertObj();
   alert.Type = AlertTypes.Error;
   try {
      const response = await httpCaller.put(`${API_URL}/User/Put/TokenPasswordRest`, { token, password });
      switch (response?.status) {
         case 200: // Ok Response
            await response.json().then((data: User) => {
            });
            //dispatch({
            //   type: "TOKEN_AUTHENTICATION",
            //   payload: {
            //      isAuthenticated: false,
            //      user: new User(),
            //   }
            //});
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

   return alert;
};