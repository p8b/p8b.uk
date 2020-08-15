import { IAuthenticationReducer } from "../reducers/AuthenticationReducer";
import { API_URL, CommonErrors } from "../core/AppConst";
import { User, ExternalLoginInfo, AlertObj, Error, LoginInfo } from "p8b.core.ts/src/components/Classes";
import { AlertTypes, AccessClaims } from "p8b.core.ts/src/components/Constant.Variables";
import { httpCaller, getCookieValue } from "p8b.core.ts/src/components/Functions";


export const postExternalLogin = (
   externalLoginInfo = new ExternalLoginInfo(),
   callBack: (state: IAuthenticationAction, ...callBackArgs: any[]) => void = () => { },
   callBackArgs: any[] = []) => {
   return async (dispatch: (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IAuthenticationAction = {
         type: "LOGIN",
         payload: {
            isAuthenticated: false,
            user: new User()
         },
         alert: new AlertObj([], AlertTypes.Error)
      };
      try {
         const response = await httpCaller.post(`${API_URL}/Authentication/Post/ExternalLogin`, externalLoginInfo);
         switch (response?.status) {
            case 200: // Ok
               await response.json().then((data: User) => {
                  state.payload.user = new User(data);
                  state.payload.isAuthenticated = true;
               });
               break;
            case 204: // No Content
               break;
            case 206: // Partial Content
               await response.json().then((data: User) => {
                  state.payload.user = new User(data);
               });
               break;
            case 417: //Expectation Failed
               await response.json().then((data: Error[]) => {
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

      dispatch(state);
      callBack!(state, ...callBackArgs!);
      return state;
   };
};

export const postLogin = (
   userInfo: LoginInfo,
   callBack?: (state: IAuthenticationAction, ...callBackArgs: any[]) => void,
   callBackArgs: any[] = []) => {
   return async (dispatch:
      (arg: IAuthenticationAction) => IAuthenticationAction) => {
      let state: IAuthenticationAction = {
         type: "LOGIN",
         payload: {
            isAuthenticated: false,
            user: new User(),
         },
         alert: new AlertObj([], AlertTypes.Error),
      };
      let accessClaimFailed = false;
      try {
         const response = await httpCaller.post(`${API_URL}/authentication/Login`, userInfo);
         switch (response?.status) {
            case 200: // Created Response
               await response.json().then((data: User) => state.payload.user = data);
               switch (state.payload.user.role!.accessClaim) {
                  case AccessClaims.Admin:
                  case AccessClaims.Manager:
                  case AccessClaims.Staff:
                  case AccessClaims.Customer:
                     state.payload.isAuthenticated = true;
                     break;
                  default:
                     accessClaimFailed = true;
                     state.alert.List.push(CommonErrors.AccessPermissionFailed);
                     break;
               }
               break;
            case 400: //Bad Response
            case 401: //Unauthorized
            case 417: //ExpectationFailed
               await response.json().then((data: Error[]) => state.alert.List = data);
               break;
            default:
               CommonErrors.BadServerResponseCode.value = `Server Error Code: ${response?.status || CommonErrors.BadServerConnection.value}`;
               state.alert.List.push(CommonErrors.BadServerResponseCode);
               break;
         };
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      if (!accessClaimFailed)
         dispatch(state);
      callBack!(state, ...callBackArgs!);
      return state;
   };
};

export const getLogout = () => {
   return async (dispatch:
      (arg: IAuthenticationAction) => void) => {
      let state: IAuthenticationAction = {
         type: "LOGIN",
         payload: {
            isAuthenticated: false,
            user: new User(),
         },
         alert: new AlertObj([], AlertTypes.Error),
      };
      try {
         await httpCaller.get(`${API_URL}/authentication/logout`);
         dispatch(state);
      } catch (e) { }
   };
};

export const getSilentAuthentication = (
   currentAuthentication: boolean
) => {
   return async (dispatch:
      (arg: IAuthenticationAction) => void) => {
      let state: IAuthenticationAction = {
         type: "SILENT_AUTHENTICATION",
         payload: {
            isAuthenticated: false,
            user: new User(),
         },
         alert: new AlertObj([], AlertTypes.Error),
      };
      //console.log(await httpCaller.post(`${API_URL}/Authentication/VarifyAntiforgeryToken`));
      if (getCookieValue("AF-TOKEN") === "")
         await httpCaller.get(`${API_URL}/Authentication/GetAntiforgeryToken`);
      // console.log(await httpCaller.post(`${API_URL}/Authentication/VarifyAntiforgeryToken`));

      let accessClaimFailed: boolean = false;
      const response = await httpCaller.get(`${API_URL}/authentication/silent`);
      try {
         switch (response?.status) {
            case 200: // Ok response
               state.payload.isAuthenticated = true;
               await response.json().then((data: User) => state.payload.user = data);
               switch (state.payload.user.role!.accessClaim) {
                  case AccessClaims.Admin:
                  case AccessClaims.Manager:
                  case AccessClaims.Staff:
                  case AccessClaims.Customer:
                     state.payload.isAuthenticated = true;
                     break;
                  default:
                     accessClaimFailed = true;
                     break;
               }
               break;
            default:
               break;
         };

         if (currentAuthentication !== state.payload.isAuthenticated && !accessClaimFailed) {
            dispatch(state);
         }
      } catch (e) {
         state.alert.List.push(CommonErrors.BadServerResponse);
      }
      return state;
   };
};

export declare type IAuthenticationAction = {
   type: string,
   payload: IAuthenticationReducer,
   alert: AlertObj,
};