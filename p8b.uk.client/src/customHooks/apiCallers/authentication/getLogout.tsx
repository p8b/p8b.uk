import { httpCaller } from "../../../core/appFunc";
import { API_URL } from "../../../core/constant.Variables";

export const useLogout = async () => {
   try {
      const result = await httpCaller.get(`${API_URL}/authentication/logout`);

      if (result?.ok)
         return { isLogout: true };
   } catch (e) { }
   return { isLogout: false };
};