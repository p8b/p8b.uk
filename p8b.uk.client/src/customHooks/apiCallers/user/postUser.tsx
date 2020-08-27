import { AlertObj, Error } from "../../../core/appClasses";
import { User } from "../../../core/apiClass";
import { httpCaller } from "../../../core/appFunc";
import { API_URL, CommonErrors, AlertTypes } from "../../../core/constant.Variables";

export const useCreateCustomer = async (newUser: User) => {
   let alert = new AlertObj([], AlertTypes.Error);
   try {
      const response = await httpCaller.post(`${API_URL}/User/Post/NewCustomer`, newUser);
      console.log(response);
      switch (response?.status) {
         case 201: // Created Response
            await response.json().then((data: User) => {
            });
            break;
         case 422: //Unprocessable Entity
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

