import React from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSilentAuthentication, getLogout } from "../actions/AuthenticationAction";
import { IReduxStoreState } from "../reducers";

/// Protected Route pure component is used
/// to decide the access to the routed component.
/// props values is received from the app.js component
const CustomRoute = (props: IProps) => {
   const result = props.getSilentAuthentication(props?.Authentication.isAuthenticated);
   if (result.accessClaimFailed) {
      props.getLogout();
   }
   return (<Route exact={props?.exact} path={props.path} render={props.Render} />);
};

/// Redux Connection before exporting the component
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
      getSilentAuthentication,
      getLogout
   }, dispatch)
)(CustomRoute);

declare type IProps = {
   getSilentAuthentication?: any,
   Authentication?: any,
   getLogout?: any,
   path: string,
   Render: any,
   exact?: boolean;
};