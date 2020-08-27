import { getCookieValue, httpCaller } from "../../../core/appFunc";
import { useContext } from "react";
import { AuthContext } from "../../../core/authenticationContext";
import { API_URL } from "../../../core/constant.Variables";
import { User } from "../../../core/apiClass";

export const useSilentAuthentication = async () => {
   const auth = useContext(AuthContext);
   //console.log(await httpCaller.post(`${API_URL}/Authentication/VarifyAntiforgeryToken`));
   if (getCookieValue("AF-TOKEN") === "")
      console.log(await httpCaller.get(`${API_URL}/Authentication/GetAntiforgeryToken`));
   //console.log(await httpCaller.post(`${API_URL}/Authentication/VarifyAntiforgeryToken`));

   const response = await httpCaller.get(`${API_URL}/authentication/silent`);
   try {
      switch (response?.status) {
         case 200: // Ok
            await response.json().then((data: User) => {
               if (auth.state.isAuthenticated !== true || auth.state.user !== data)
                  auth.setState({ isAuthenticated: true, user: data });
            });
            break;
         default:
            auth.setState({ isAuthenticated: false, user: new User() });
            break;
      };
   } catch (e) { }
};