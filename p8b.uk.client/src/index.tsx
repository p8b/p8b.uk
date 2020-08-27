﻿import "./core/type.Extensions";
import React from "react";
import { render } from "react-dom";
//import { Provider } from "react-redux";
//import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
//import { persistor, store } from "./reducers";
import "./scss/main.scss";

render(
   /* <Provider store={store}>*/
   /*<PersistGate loading={null} persistor={persistor}>*/
   <App />
      /*</PersistGate>*/
   /*</Provider>*/,
   document.getElementById("rootDiv"));
