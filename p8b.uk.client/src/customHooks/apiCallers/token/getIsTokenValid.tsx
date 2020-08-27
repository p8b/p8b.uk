import { AlertObj, Error } from "../../../core/appClasses";
import { httpCaller } from "../../../core/appFunc";
import { API_URL, AlertTypes, CommonErrors } from "../../../core/constant.Variables";

export const useIsTokenValid = async (token: string) => {
   let alert = new AlertObj([], AlertTypes.Error);
   let isTokenValid = false;
   try {
      const response = await httpCaller.get(`${API_URL}/Token/Get/IsTokenValid/${token}`);
      switch (response!.status) {
         case 200: // Ok Response
            await response?.json().then(data => {
               isTokenValid = data.isTokenValid;
            });
            break;
         case 412: //Precondition Failed
         case 417: //Expectation Failed)
            await response?.json().then((data: Error[]) => {
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
   return [alert, isTokenValid];
};