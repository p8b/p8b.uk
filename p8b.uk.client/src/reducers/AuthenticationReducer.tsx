import { IAuthenticationAction } from "../actions/AuthenticationAction";
import { User } from "p8b.core.ts/src/components/Classes";

const AuthenticationReducer = (state: IAuthenticationReducer = {
   isAuthenticated: false,
   user: new User(),
}, action: IAuthenticationAction) => {
   switch (action.type) {
      case "LOGIN":
      case "LOGOUT":
      case "SILENT_AUTHENTICATION":
      case "TOKEN_AUTHENTICATION":
         return action.payload;
      default:
         return state;
   }
};
export default AuthenticationReducer;

export declare type IAuthenticationReducer = {
   isAuthenticated: boolean,
   user: User,
};