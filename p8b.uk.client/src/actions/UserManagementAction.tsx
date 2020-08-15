import { CommonErrors, API_URL } from "../core/AppConst";
import { IAuthenticationAction } from "./AuthenticationAction";
import { User, AlertObj, Error } from "p8b.core.ts/src/components/Classes";
import { AlertTypes } from "p8b.core.ts/src/components/Constant.Variables";
import { httpCaller } from "p8b.core.ts/src/components/Functions";

export const postCustomer = (
   newUser = new User(),
   callBack?: (state: IUserManagmentAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IUserManagmentAction) => IUserManagmentAction) => {
      let state: IUserManagmentAction = {
         user: new User(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         //if (newUser.role?.id == null)
         //   newUser.role!.id = 0;
         console.log(newUser);
         const response = await httpCaller.post(`${API_URL}/User/Post/NewCustomer`, newUser);
         console.log(response);
         switch (response?.status) {
            case 201: // Created Response
               await response.json().then((data: User) => {
                  console.log(data);
                  state.user = data;
                  console.log(state);
               });
               break;
            case 422: //Unprocessable Entity
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
               await response.json().then((data: Error[]) => {
                  state.alert.List = data;
               });
               break;
            default:
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
         if (response == null)
            state.alert.List.push(CommonErrors.BadServerConnection);
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      callBack!(state, ...callBackArgs!);
      return state;
   };
};

export const putTokenPasswordRest = (
   token = "",
   password = "",
   callBack?: (state: IUserManagmentAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IUserManagmentAction = {
         user: new User(),
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.put(`${API_URL}/User/Put/TokenPasswordRest`, { token, password });
         switch (response?.status) {
            case 200: // Ok Response
               await response.json().then((data: User) => {
                  state.user = data;
               });
               dispatch({
                  type: "TOKEN_AUTHENTICATION",
                  payload: {
                     isAuthenticated: false,
                     user: new User(),
                  },
                  alert: new AlertObj([], AlertTypes.Error),
               });
               break;
            case 412: //Precondition Failed
            case 417: //Expectation Failed)
               await response.json().then((data: Error[]) => {
                  state.alert.List = data;
               });
               break;
            default:
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
         if (response == null)
            state.alert.List.push(CommonErrors.BadServerConnection);
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      callBack!(state, ...callBackArgs!);
      return state;
   };
};

//export const putUser = (
//    modifiedUser = new User(),
//    callBack = () => { },
//    callBackArgs = []) => {
//    return async dispatch => {
//        let state = {
//            user: new User(),
//            errors: []
//        };
//        try {
//            const response = await apiCaller.put("User/Put", modifiedUser);
//            switch (response.status) {
//                case 200: // Ok Response
//                    await response.json().then(data => {
//                        state.user = new User(data);
//                    }).catch(e => { console.log(e); });
//                    break;
//                case 412: //Precondition Failed
//                case 422: //Unprocessable Entity
//                case 404: //Not Found
//                case 417: //Expectation Failed
//                    await response.json().then(data => {
//                        data.map(e => {
//                            state.errors.push(new oError(e));
//                        });
//                    }).catch(e => { console.log(e); });
//                    break;
//                default:
//                    state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.status}` }));
//                    break;
//            };
//        } catch (e) {
//            state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
//        }
//        callBack(state, ...callBackArgs);
//        return state;
//    };
//};

//export const putPassword = (
//    password = "",
//    callBack = () => { },
//    callBackArgs = []) => {
//    return async dispatch => {
//        let state = {
//            user: new User(),
//            errors: []
//        };
//        try {
//            const response = await apiCaller.put("User/PutMyPassword", password);
//            switch (response.status) {
//                case 200: // Ok Response
//                    await response.json().then(data => {
//                        state.user = new User(data);
//                    }).catch(e => { console.log(e); });
//                    break;
//                case 412: //Precondition Failed
//                case 422: //Unprocessable Entity
//                case 404: //Not Found
//                case 417: //Expectation Failed
//                    await response.json().then(data => {
//                        data.map(e => {
//                            state.errors.push(new oError(e));
//                        });
//                    }).catch(e => { console.log(e); });
//                    break;
//                default:
//                    state.errors.push(new oError({ key: "ConnectionError", value: `Server Error Code: ${response.status}` }));
//                    break;
//            };
//        } catch (e) {
//            state.errors.push(new oError({ key: "ConnectionError", value: "Server Connection Error" }));
//        }
//        callBack(state, ...callBackArgs);
//        return state;
//    };
//};

export interface IUserManagmentAction {
   user: User,
   alert: AlertObj;
}