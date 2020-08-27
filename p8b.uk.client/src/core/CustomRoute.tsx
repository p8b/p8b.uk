import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSilentAuthentication } from "../customHooks/apiCallers/authentication/getSilentAuthentication";
import { AuthContext } from "./authenticationContext";

const CustomRoute = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [prevPath, setPrevPath] = useState("");

   if (prevPath !== props.path) {
      useSilentAuthentication();
      setPrevPath(props.path);
   }
   if (props.AuthRequired && !auth.state.isAuthenticated)
      return (<Redirect to={{ pathname: "/Login", state: { fromPath: props.path } }} />);

   return (<Route exact={props?.exact} path={props.path} render={props.Render} />);
};
declare type IProps = {
   path: string,
   Render: any,
   exact?: boolean;
   AuthRequired?: boolean;
};
export default CustomRoute;