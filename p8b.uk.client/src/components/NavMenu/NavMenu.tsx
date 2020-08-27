import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { DefaultNav, LoginNav } from "./NavMenuItems";
import { AccessClaims } from "../../core/constant.Variables";
import { AuthContext } from "../../core/authenticationContext";
import { useLogout } from "../../customHooks/apiCallers/authentication/getLogout";
import { User } from "../../core/apiClass";
import { useDetectOutsideClick } from "../../customHooks/sharedStateHooks/useDetectOutsideClick";

// Navigation menu component
const NavMenu = (props: IProps) => {
   const [NavContainer] = useState(React.createRef<HTMLDivElement>());
   const [myAccDropDownButton] = useState(React.createRef<HTMLAnchorElement>());
   const [initLoad, setInitLoad] = useState(true);
   const auth = useContext(AuthContext);
   const outsideClickSmallNav = useDetectOutsideClick(NavContainer, false);
   const outsideClickMyAccDropDown = useDetectOutsideClick(myAccDropDownButton, false);
   const [currentNavItems, setCurrentNavItems] = useState(DefaultNav);
   const [selectedNav, setSelectedNav] = useState(window.location.pathname);

   useEffect(() => {
      setInitLoad(false);
   }, []);
   const logout = async () => {
      const result = await useLogout();
      if (result.isLogout) {
         auth.setState({ isAuthenticated: false, user: new User() });
         setCurrentNavItems(DefaultNav);
      }
   };
   const setSelectedNavItem = async () => {
      /// must be delayed to avoid render conflicts
      await new Promise(resolve => setTimeout(resolve, 1));
      if (selectedNav !== window.location.pathname)
         setSelectedNav(window.location.pathname);
   };
   useEffect(() => {
      /// Check which menu items to show for the user
      switch (auth.state.user.role?.accessClaim) {
         case AccessClaims.Admin:
         case AccessClaims.Manager:
         case AccessClaims.Customer:
         case AccessClaims.Staff:
         case AccessClaims.User:
            setCurrentNavItems(LoginNav);
            break;
         default:
            setCurrentNavItems(DefaultNav);
            break;
      }
   }, [auth.state.isAuthenticated]);
   return (
      <header>
         <nav id="navbar" ref={NavContainer}
            className="navbar bg-white navbar-expand-md m-0 p-0">
            {/** Logo & toggler icon */}
            <Link to="/" className="logo-container"
               children={<img id="logo" alt="Logo" className="Logo " />} />
            <button className={`fas toggler-icon ${outsideClickSmallNav.isActive ? "show" : "hide"}`}
               type="button" name="toggler"
               onClick={() => { outsideClickSmallNav.setIsActive((prevVal) => !prevVal); }} />

            <div className={`d-md-inline-flex flex-md-row col-12 col-md p-0 collapse ${outsideClickSmallNav.isActive ? "show bg-white bg-solid" : !initLoad && 'hide'}`}
            >
               <div className="ml-auto" />
               {/** user links */}
               {currentNavItems.map(link =>
                  <Link key={link.id} children={<div className="w-auto ml-auto mr-auto">{link.displayName}</div>}
                     className={`navbar text-nav bg-white ${selectedNav === link.path ? "visited" : ""}`}
                     to={() => {
                        setSelectedNavItem();
                        return link.path;
                     }}
                     onClick={() => outsideClickSmallNav.setIsActive(false)}
                  />
               )}
               {auth.state.isAuthenticated &&
                  <>
                     <div className="dropdown">
                        <a className={` bg-white text-underline dropdown-toggle navbar text-nav
                                    ${selectedNav === "/MyAccount" ? "visited" : ""}`}
                           children={<div className="w-auto ml-auto mr-auto">My Account</div>}
                           onClick={() => outsideClickMyAccDropDown.setIsActive(true)}

                        />
                        <span ref={myAccDropDownButton}
                           className={`dropdown-menu text-center dropdown-menu-right bg-white dropdown-span ${outsideClickMyAccDropDown.isActive ? "show" : ""}`}>
                           <Link className="dropdown-item" key="1"
                              to={() => {
                                 setSelectedNavItem();
                                 return "/MyAccount";
                              }}
                              children="Account"
                              onClick={() => outsideClickMyAccDropDown.setIsActive(false)}
                           />
                           <Link to="" className="dropdown-item" key="2"
                              onClick={() => {
                                 outsideClickMyAccDropDown.setIsActive(false);
                                 logout();
                              }}
                              children="Logout" />
                        </span>
                     </div>
                  </>
               }
            </div>
         </nav>
      </header>
   );
};

declare type IProps = {
};
export default NavMenu;
