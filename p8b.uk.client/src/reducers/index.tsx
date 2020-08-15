import { combineReducers } from "redux";
import { createStore, applyMiddleware, Store } from "redux";
// Used to add developer tool functionalities for debugging
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import AuthenticationReducer, { IAuthenticationReducer } from "./AuthenticationReducer";

export declare type IReduxStoreState = {
   Authentication: IAuthenticationReducer,
};

const AllReducers = combineReducers(
   {
      Authentication: AuthenticationReducer,
   });

const persistConfig = {
   key: "root",
   storage,
};

const persistedReducer = persistReducer(persistConfig, AllReducers);

const store: Store = createStore(
   persistedReducer,
   process.env.NODE_ENV === "production"
      ? applyMiddleware(thunk)
      : composeWithDevTools(applyMiddleware(thunk))
);

const persistor: Persistor = persistStore(store);
export { store, persistor };
