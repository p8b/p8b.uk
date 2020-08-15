import { Error } from "p8b.core.ts/src/components/Classes";


//#region *** *** Common URLs *** ***
//export const API_URL: string = "https://localhost:44366";
export const API_URL: string = "https://api.p8b.uk";
//#endregion

export class CommonErrors {
   public static BadServerResponse: Error = new Error("ConnectionError", "Bad Server Response.");
   public static BadServerResponseCode: Error = new Error("ConnectionError", "Server Error Code: 000");
   public static BadServerConnection: Error = new Error("ConnectionError", "Cannot connect to server.");
   public static AccessPermissionFailed: Error = new Error("ConnectionError", "You do not have the right access permission. please contact administrator for more information.");
}; 