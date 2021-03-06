﻿import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { Row } from "./PureElements/Row";
import { Toggler } from "./Inputs/Toggler";

const Footer = () => {
   let togglerChecked = false;
   if (window.localStorage.getItem("isThemeDark") === "true") {
      document.body!.classList.add("dark-theme");
      togglerChecked = true;
   }
   return (
      <footer id="footer" className="footer pt-4 slideInFromBottom">
         <Container className="w-100">
            <Row className="m-0">
               <Row className="col-12 justify-content-center p-0 m-0 mt-2 ">
                  <div className="col-6 h5 pl-2 pr-2 m-0 text-right">
                     <Link to="/About">About</Link>
                  </div>
                  <div className="col-6 h5 pl-2 pr-2 m-0 text-left" >
                     <Link to="/Contact">Contact</Link>
                  </div>
               </Row>
               <Row className="col-12 justify-content-center p-0 m-0 mt-2">
                  <label className="col-6 h5 pl-2 pr-2 m-0 text-right" children="Theme" />
                  <Toggler lblValue="Light"
                     lblAltValue="Dark"
                     defaultChecked={togglerChecked}
                     className="col-6 h5 pl-2 pr-2 m-0 text-left toggler-lg"
                     onChange={checked => {
                        if (checked) {
                           window.localStorage.setItem("isThemeDark", "true");
                           document.body!.classList.add("dark-theme");
                        }
                        else {
                           window.localStorage.setItem("isThemeDark", "false");
                           document.body!.classList.remove("dark-theme");
                        }
                     }} />
               </Row>
               <Row className="col-12 justify-content-center p-0 m-0 mt-2">
                  <div className="col-6 pl-2 pr-2 m-0 text-right">
                     <a href="https://uk.linkedin.com/in/majidjoveini"
                        target="_blank" rel="noreferrer"
                        className="linkedin" children="linkedin" />
                  </div>
                  <div className="col-6 pl-2 pr-2 m-0 text-left">
                     <a href="https://github.com/p8b"
                        target="_blank" rel="noreferrer"
                        className="github" children="github" />
                  </div>
               </Row>
               <div className="col-12 text-center p-0 m-0 cursor-default" children="&copy; 2020 P8B" />
            </Row>
         </Container>
      </footer >
   );
};
export default Footer;
