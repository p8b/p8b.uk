import React from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { DefaultNav, LoginNav, INavItem } from "./NavMenuItems";

import { getLogout } from "../../actions/AuthenticationAction";
import { IAuthenticationReducer } from "../../reducers/AuthenticationReducer";
import { PurifyComponent } from "p8b.core.ts/src/components/Class.Extensions";
import { AccessClaims } from "p8b.core.ts/src/components/Constant.Variables";
import { Collapse } from "p8b.components.react/src/components/PureElements/_index";

// Navigation menu component
class NavMenu extends PurifyComponent<IProps> {
   myState: IMyState = {
      toggleContainerNavBar: React.createRef(),
      toggleContainerDropdown: React.createRef(),
      smScreenNavIsOpen: false,
      myAccDropdownBool: false,
      refreshNavItems: true,
      CurrentNavItems: [],
      selectedNav: window.location.pathname,
      logoAnimation: "slideInFromLeft",
      menuAnimation: "slideInFromRight",
      windowOffsetY: window.pageYOffset
   };
   constructor(props: IProps) {
      super(props);
      this.logout = this.logout.bind(this);
      this.toggleNavbar = this.toggleNavbar.bind(this);
      this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
      this.onScroll = this.onScroll.bind(this);

   }

   componentDidMount() {
      this.initLoad = false;
      window.addEventListener("mousedown", this.onClickOutsideHandler);
      window.addEventListener("scroll", this.onScroll);
   }
   componentWillUnmount() {
      window.removeEventListener("mousedown", this.onClickOutsideHandler);
      window.removeEventListener("scroll", this.onScroll);
   }
   onScroll() {
      var currentScrollPos = window.pageYOffset;
      if ((this.myState.windowOffsetY + (this.myState.toggleContainerNavBar.current!.getBoundingClientRect().height / 2)) >= currentScrollPos) {
         this.reRender(() => {
            this.myState.logoAnimation = "slideInFromLeft";
            this.myState.menuAnimation = "slideInFromRight";
         });
      } else {
         this.reRender(() => {
            this.myState.logoAnimation = "slideOutFromBottom";
            this.myState.menuAnimation = "slideOutFromRight";
         });
      }
   }
   onClickOutsideHandler(event: any) {
      if (event.target.classList.value.includes("toggler-icon"))
         return;

      const { myAccDropdownBool, smScreenNavIsOpen, toggleContainerDropdown, toggleContainerNavBar } = this.myState;
      // only if the drop-down menu is activated and the user clicks away from the menu
      try {
         if (myAccDropdownBool && !toggleContainerDropdown.current?.contains(event.target))
            this.reRender(() => this.myState.smScreenNavIsOpen = false);
      } catch (e) { }

      // close Navigation menu in small screen when user clicks away from the menu (When user is logged in)
      // this is used so that the navigation menu is not closed when the drop-down items are selected
      try {
         if (smScreenNavIsOpen && !toggleContainerDropdown.current?.contains(event.target)
            && !toggleContainerNavBar.current?.contains(event.target))
            this.reRender(() => this.myState.smScreenNavIsOpen = !smScreenNavIsOpen);
      } catch (e) {
         // if the user is NOT logged in the error is thrown
         // then try to hide the navigation menu in small screen
         try {
            if (smScreenNavIsOpen && !this.myState.toggleContainerNavBar.current?.contains(event.target))
               this.reRender(() => this.myState.smScreenNavIsOpen = !smScreenNavIsOpen);
         } catch (e) { }
      }
   }
   async toggleNavbar() {
      this.reRender(() => this.myState.smScreenNavIsOpen = !this.myState.smScreenNavIsOpen);
   }

   async logout() {
      await this.props.getLogout();
      this.reRender(() => {
         this.myState.CurrentNavItems = DefaultNav;
         this.myState.refreshNavItems = false;
      });
   }
   render() {
      if (this.myState.refreshNavItems) {
         /// Check which menu items to show for the user
         switch (this.props.Authentication.user.role?.accessClaim) {
            case AccessClaims.Admin:
            case AccessClaims.Manager:
            case AccessClaims.Customer:
            case AccessClaims.Staff:
            case AccessClaims.User:
               this.myState.CurrentNavItems = LoginNav;
               break;
            default:
               this.myState.CurrentNavItems = DefaultNav;
               break;
         }
      } else {
         this.myState.refreshNavItems = true;
      }
      return (
         <header>
            <div className="navbar navbar-expand-md m-0 p-0">
               {/** Logo & toggler icon */}
               <Link to="/" children={<img alt="OSnack" className="Logo" />}
                  className="logo-container" />
               <button className={`fas toggler-icon ${this.myState.smScreenNavIsOpen ? "show" : "hide"}`}
                  type="button" name="toggler"
                  onClick={this.toggleNavbar} />

               <Collapse className="navbar-collapse bg-sm-white bg-solid hide" initLoad={this.initLoad}
                  reff={this.myState.toggleContainerNavBar}
                  isOpen={this.myState.smScreenNavIsOpen}>
                  <div className="ml-auto" />
                  {/** user links */}
                  {this.myState.CurrentNavItems.map(link =>
                     <Link key={link.id} children={<div className="w-auto ml-auto mr-auto">{link.displayName}</div>}
                        className={`navbar text-nav ${this.myState.selectedNav === link.path ? "visited" : ""}`}
                        to={() => {
                           if (this.myState.selectedNav !== window.location.pathname)
                              this.reRender(() => this.myState.selectedNav = window.location.pathname, 1);
                           return link.path;
                        }}
                     />
                  )}
                  {this.props.Authentication.isAuthenticated &&
                     <div className="dropdown" ref={this.myState.toggleContainerDropdown}>
                        <a className="text-nav navbar text-underline dropdown-toggle"
                           onClick={() => this.reRender(() =>
                              this.myState.myAccDropdownBool = !this.myState.myAccDropdownBool
                           )}
                           children="My Account"
                        />
                        {this.myState.myAccDropdownBool && (
                           <span className={"dropdown-menu text-center dropdown-menu-right bg-white dropdown-span show"}>
                              <Link className="dropdown-item text-nav" key="0"
                                 to="/MyOrders"
                                 children="Orders" />
                              <Link className="dropdown-item text-nav" key="1"
                                 to="/MyAccount"
                                 children="Account" />

                              <a className="dropdown-item text-nav" key="2"
                                 onClick={this.logout}
                                 children="Logout" />
                           </span>
                        )}
                     </div>
                  }
               </Collapse>
            </div>
         </header>
      );
   }
}

declare type IMyState = {
   toggleContainerNavBar: React.RefObject<HTMLDivElement>;
   toggleContainerDropdown: React.RefObject<HTMLDivElement>;
   smScreenNavIsOpen: boolean;
   myAccDropdownBool: boolean;
   refreshNavItems: boolean;
   CurrentNavItems: INavItem[];
   selectedNav: string;
   logoAnimation: string;
   menuAnimation: string;
   windowOffsetY: number;
};
declare type IProps = {
   getLogout: typeof getLogout,
   Basket: [],
   Authentication: IAuthenticationReducer;
};
export default connect(
   (state: any) => {
      return {
         Authentication: state.Authentication,
         Basket: state.Basket
      };
   },
   (dispatch) => bindActionCreators(
      {
         getLogout
      }, dispatch))
   (NavMenu);