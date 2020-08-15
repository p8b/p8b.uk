import { ContactMe } from "../core/AppClass";
import { AlertObj, Error } from "p8b.core.ts/src/components/Classes";
import { AlertTypes } from "p8b.core.ts/src/components/Constant.Variables";
import { httpCaller } from "p8b.core.ts/src/components/Functions";
import { API_URL, CommonErrors } from "../core/AppConst";

export const postContactMe = (
   contactMe = new ContactMe(),
   callBack: (state: IContactMeAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IContactMeAction) => IContactMeAction) => {
      let state: IContactMeAction = {
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         console.log(contactMe);
         const response = await httpCaller.post(`${API_URL}/ContactMe/PostMessege`, contactMe);
         switch (response?.status) {
            case 200: // OK Response
               await response.json().then((data: string) => {
                  state.alert.Type = AlertTypes.Success;
                  state.alert.List = [new Error("SuccessMsg", data)];
               });
               break;
            case 422: //UnprocessableEntity
            case 417: //Expectation Failed
               await response.json().then((data: Error[]) => {
                  state.alert.Type = AlertTypes.Error;
                  state.alert.List = data;
               });
               break;
            default:
               if (response == null) {
                  state.alert.List.push(CommonErrors.BadServerConnection);
                  break;
               }
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      callBack!(state, ...callBackArgs!);
      return state;
   };
};
export declare type IContactMeAction = {
   alert: AlertObj;
};

