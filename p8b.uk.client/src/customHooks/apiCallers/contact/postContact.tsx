import { AlertObj, Error } from '../../../core/appClasses';
import { ContactMe } from '../../../core/apiClass';
import { httpCaller } from '../../../core/appFunc';
import { API_URL, AlertTypes, CommonErrors } from '../../../core/constant.Variables';

const useContactMe = async (contactMe: ContactMe) => {
   let alert = new AlertObj();
   try {
      const response = await httpCaller.post(`${API_URL}/ContactMe/PostMessege`, contactMe);
      switch (response?.status) {
         case 200: // OK Response
            await response.json().then((data: string) => {
               alert.Type = AlertTypes.Success;
               alert.List.push(new Error("SuccessMsg", data));
            });
            break;
         case 422: //UnprocessableEntity
         case 417: //Expectation Failed
            await response.json().then((data: Error[]) => {
               alert.Type = AlertTypes.Error;
               alert.List = data;
            });
            break;
         case 400: // Bad Request (could be that anti-forgery is invalid)
            await httpCaller.get(`${API_URL}/Authentication/GetAntiforgeryToken`);
            alert.Type = AlertTypes.Warning;
            alert.List.push(CommonErrors.TryAgain);
            break;
         default:
            alert.Type = AlertTypes.Error;
            if (response == null) {
               alert.List.push(CommonErrors.BadServerConnection);
               break;
            }
            CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}. `;
            alert.List.push(CommonErrors.BadServerResponseCode);
            break;
      };
   } catch (e) {
      alert.List.push(CommonErrors.BadServerResponse);
   }
   return alert;
};
export default useContactMe;