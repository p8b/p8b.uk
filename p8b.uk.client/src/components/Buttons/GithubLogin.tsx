import React from 'react';
import { uuidv4 } from '../../core/appFunc';
import { ExternalLoginInfo } from '../../core/apiClass';
import { RegistrationTypes } from '../../core/constant.Variables';

const GitHubLogin = (props: IProps) => {
   let scope = "user:email";
   let callBackWasCalled = false;
   const login = async () => {
      props!.onClick!();
      localStorage.setItem("gitState", uuidv4());
      const windowPop: Window | null = window.open(`https://github.com/login/oauth/authorize?client_id=${props.clientId}&scope=${scope}&state=${localStorage.getItem('gitState')}`,
         "_blank", "width=400,height=500");

      let timer = setInterval(() => {
         if (windowPop!.closed) {
            clearInterval(timer!);
            if (!callBackWasCalled)
               props.onClosedWithoutAction!();
            else
               callBackWasCalled = false;
         }
      }, 1000) as unknown as NodeJS.Timeout;
      windowPop!.opener.callBack = () => {
         callBackWasCalled = true;
         const reply = windowPop!.document.location.search.replace("?code", "")!.replace("&state", "")!.split('=');
         if (reply![2] != null && localStorage.getItem("gitState") === reply![2]) {
            props.onSuccess(new ExternalLoginInfo(reply![1], reply![2], RegistrationTypes.Github));
            localStorage.removeItem("gitState");
         } else props.onFailure("Github Login Failed. Cannot retrieve code!");
      };
   };
   try {
      const reply = document.location.search.replace("?code", "")!.replace("&state", "")!.split('=');
      if (reply![2] != null && localStorage.getItem("gitState") === reply![2]) {
         window.opener.callBack?.call(null);
         window.close();
      }
   } catch (e) { }
   return <button children={props.children}
      className={props?.className}
      onClick={login}
   />;
};
declare type IProps = {
   clientId: string,
   children: any,
   className?: string,
   onSuccess: (info: ExternalLoginInfo) => void;
   onFailure: (msg: string) => void;
   onClick?: () => void,
   onClosedWithoutAction?: () => void,
};
export default GitHubLogin;