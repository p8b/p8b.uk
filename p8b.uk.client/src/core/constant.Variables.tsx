import { Error } from "./appClasses";

//export const API_URL: string = "https://localhost:44366";
export const API_URL: string = "https://api.p8b.uk";
export const GetAllRecords: string = "***GET-ALL***";
//export const ConstMaxNumberOfPerItemsPage = 30;

export enum AlertTypes {
   Success = 0,
   Error = 1,
   Warning = 2,
};

export enum RegistrationTypes {
   Application = 0,
   Google = 1,
   Facebook = 2,
   Github = 3
};

export const AccessClaims = {
   Admin: "Admin",
   Manager: "Manager",
   Customer: "Customer",
   User: "User",
   Staff: "Staff",
   None: "",
   List: [
      { id: 0, name: "Admin" },
      { id: 1, name: "Customer" },
      { id: 4, name: "User" },
      { id: 2, name: "Manager" },
      { id: 3, name: "Staff" },
   ]
};

export class CommonRegex {
   public static Email: string = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
   public static UkNumber: string = "^\\+?(?:\\d\\s?){10,12}$";
};

export class CommonErrors {
   public static PersistentErrorMsg: string = "(If this issue persists please contact the administrator on majid.joveini@gmail.com)";
   public static TryAgain: Error = new Error("TryAgain", `Please try again. ${CommonErrors.PersistentErrorMsg}`);
   public static BadServerResponse: Error = new Error("ServerError", `Bad Server Response. ${CommonErrors.PersistentErrorMsg}`);
   public static BadServerResponseCode: Error = new Error("ServerError", `Server Error Code: 000 ${CommonErrors.PersistentErrorMsg}`);
   public static BadServerConnection: Error = new Error("ConnectionError", `Cannot connect to server. ${CommonErrors.PersistentErrorMsg}`);
   public static AccessPermissionFailed: Error = new Error("PermissionError", "You do not have the correct permission to access the resource requested.");
}; 