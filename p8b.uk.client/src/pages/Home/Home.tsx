import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IReduxStoreState } from "../../reducers";
import { Container } from "../../components/Container";
import { PurifyComponent } from "p8b.core.ts/src/components/Class.Extensions";
import { Divider } from "../../components/Divider";
import { Card } from "../../components/Card";
import { RF } from "p8b.components.react/src/components/PureElements/RF";
import { CopyText } from "../../components/CopyText";
import { Link } from "react-router-dom";


class Home extends PurifyComponent<IProps> {
   myState: IMyState = {
      messege: "",
      msgTimer: 0,
      iconTimer: 0

   };
   constructor(props: IProps) {
      super(props);
   }
   componentDidMount() {
      const msg = "Hi, My name is Majid, a Full Stack developer.";
      this.myState.msgTimer = setInterval(() => {
         if (msg + "_" === this.myState.messege) {
            this.reRender(() => this.myState.messege = msg);
            clearInterval(this.myState.msgTimer);
         }
         else {
            this.myState.messege = this.myState.messege.replace("_", "");
            this.reRender(() => this.myState.messege += msg[this.myState.messege.length] + "_");
         }
      }, 100) as unknown as number;
      let selectedIcon = Math.RandomInteger(0, 14);
      const animateList = ["bounce", "flash", "pulse", "rubberBand", "shakeX", "shakeY", "headShake", "swing", "tada", "wobble", "jello", "heartBeat"];
      let selectedAnimate = animateList[Math.RandomInteger(0, 12)];
      this.myState.iconTimer = setInterval(() => {
         document.getElementById(`skill-icon-${selectedIcon}`)?.classList.remove(selectedAnimate);
         selectedIcon = Math.RandomInteger(0, 14);
         selectedAnimate = animateList[Math.RandomInteger(0, 12)];
         document.getElementById(`skill-icon-${selectedIcon}`)?.classList.add(selectedAnimate);
      }, 2000) as unknown as number;
   }
   componentWillUnmount() {
      clearInterval(this.myState.msgTimer);
      clearInterval(this.myState.iconTimer);
   }

   render() {
      return (
         <Container className="custom-container bg-transparent mt-1" extendBottom>
            <div className="row">
               <div className="col-12 text-center bg-white pt-4 pb-5">
                  <div className="row col-12 justify-content-center mt-5">
                     <img className="profile-pic shadow-all" src="https://media-exp1.licdn.com/dms/image/C4D03AQGMENkXKwFHcA/profile-displayphoto-shrink_400_400/0?e=1601510400&v=beta&t=T8AClLbwi83X2F52OtHA1ZHt6lA6PgIwL3hunQTUCWY" alt="me" />
                     <h2 className="col-12 mt-3" children={this.myState.messege} />
                     <div className="col-12 text-center">
                        <a href="https://uk.linkedin.com/in/majidjoveini" target="_blank"
                           className="linkedin-lg m-2 font-0" children="L" rel="noopener" />
                        <a href="https://github.com/p8b" target="_blank"
                           className="github-lg m-2 font-0" children="G" rel="noopener" />
                        <a href="/public/docs/Majid-Joveini-CV.pdf" target="_blank"
                           className="cv-file-lg m-2 font-0" children="CV" />
                     </div>
                  </div>
                  <Divider className="m-5" />
                  <div className="col-12 m-0 p-0 text-center">
                     <img alt="JS" id="skill-icon-1" src="/public/images/icons/JS.svg" className="col skill-icon " />
                     <img alt="TS" id="skill-icon-2" src="/public/images/icons/Typescript-02.svg" className="col skill-icon" />
                     <img alt="React" id="skill-icon-3" src="/public/images/icons/React-01.svg" className="col skill-icon" />
                     <img alt="Redux" id="skill-icon-4" src="/public/images/icons/Redux-01.svg" className="col skill-icon" />
                     <img alt="Html" id="skill-icon-5" src="/public/images/icons/HTML-5-01.svg" className="col skill-icon" />
                     <img alt="Css" id="skill-icon-6" src="/public/images/icons/CSS-3-01.svg" className="col skill-icon" />
                     <img alt="SASS" id="skill-icon-7" src="/public/images/icons/Sass-01.svg" className="col skill-icon" />
                     <img alt="Bootsrap" id="skill-icon-8" src="/public/images/icons/Bootstrap-01.svg" className="col skill-icon" />
                     <img alt="Weboack" id="skill-icon-9" src="/public/images/icons/WebPack-01.svg" className="col skill-icon" />
                     <img alt="NPM" id="skill-icon-10" src="/public/images/icons/Npm-01.svg" className="col skill-icon" />
                     <img alt=".Net Core" id="skill-icon-11" src="/public/images/icons/NET_Core_Logo.svg" className="col skill-icon" />
                     <img alt="C#" id="skill-icon-12" src="/public/images/icons/C-Sharp-01.svg" className="col skill-icon" />
                     <img alt="MSSQL" id="skill-icon-13" src="/public/images/icons/Microsoft-sql-server-01.svg" className="col skill-icon-bg-white" />
                     <img alt="Photoshop" id="skill-icon-14" src="/public/images/icons/Adobe-Photoshop-CC-01.svg" className="col skill-icon" />
                  </div>
                  <Divider className="m-5" />
               </div>
               <div className="row col-12 justify-content-center text-center bg-lightgray m-0 p-0 pt-4 pb-5 mt-5">
                  <h2 className="col-12 mt-3 mb-4" children="Projects" />
                  <Card className="m-2"
                     imgSrc="/public/images/projectPics/OSnack.png"
                     imgHref="https://test.osnack.co.uk/"
                     imgAlt="Project1"
                     body={
                        <RF>
                           <p className="text-justify" children="An E-commerce website for a small company selling Mediterranean food products. It is designed in a microkernel architecture with a REST API back-end. This was a prototype based on a real company who are interested in taking it to production. So I will redesign the project to include typescript, SASS and have better performance, more features and better UI/UX design." />
                           <p className="text-justify" children="Technologies: .Net Core, React, Redux, HTML, CSS and MS SQL" />
                        </RF>}
                     footer={
                        <RF>
                           <div className="text-center mb-2">
                              <a className="col github font-0" children="G" target="_blank" href="https://github.com/p8b/OSnackFYP" rel="noopener" />
                              <a className="col eye font-0" children="L" target="_blank" href="https://test.osnack.co.uk/" rel="noopener" />
                              <a className="col eye font-0" children="L" target="_blank" href="https://management.osnack.co.uk/" rel="noopener" />
                           </div>
                           <div>Email</div>
                           <div>Customer: <CopyText className="ml-3" text="j@s.com" /></div>
                           <div>Manager: <CopyText className="ml-3" text="majid@gmail.com " /></div>
                           <div>Password:  <CopyText className="ml-3" text="As!2" /></div>
                        </RF>
                     }
                  />
                  <Card className="m-2"
                     imgSrc="/public/images/projectPics/greenwichButchers.png"
                     imgHref="http://razor.greenwichbutchers.p8b.uk/"
                     imgAlt="Project1"
                     body={
                        <RF>
                           <p className="text-justify" children="An online shop as well as bulk order service web application. This is a monolith app with server-side rendering and MVC design pattern." />
                           <p className="text-justify" children="Technologies: .Net, Razor Pages, JQuery, HTML, CSS and MS SQL" />
                        </RF>}
                     footer={
                        <RF>
                           <div className="text-center mb-2">
                              <a className="col github font-0" children="G" target="_blank" href="https://github.com/p8b/Greenwich-Butchers" rel="noopener" />
                              <a className="col eye font-0" children="L" target="_blank" href="http://razor.greenwichbutchers.p8b.uk/" rel="noopener" />
                           </div>
                           <div>Email:  <CopyText className="ml-3" text="vasilis@customer.com" /></div>
                           <div>Email:  <CopyText className="ml-3" text="Majid@Admin.com" /></div>
                           <div>Password:  <CopyText className="ml-3" text="As!234" /></div>
                        </RF>
                     }
                  />
                  <Card className="m-2"
                     imgSrc="/public/images/projectPics/greenwichIdea.png"
                     imgHref="https://comp1640.p8b.uk/"
                     imgAlt="Project1"
                     body={
                        <RF>
                           <p className="text-justify" children="An Idea submission website for the University of Greenwich (prototype). This is a monolith app with client-side rendering and REST API back-end. (Team Work)" />
                           <p className="text-justify" children="Technologies: .Net Core MVC, ReactJS, Redux, HTML, CSS and MS SQL" />
                        </RF>}
                     footer={
                        <RF>
                           <div className="text-center mb-2">
                              <a className="col github  font-0" children="G" target="_blank" href="https://github.com/p8b/G-IdeaWeb" rel="noopener" />
                              <a className="col eye font-0" children="L" target="_blank" href="https://comp1640.p8b.uk/" rel="noopener" />
                           </div>
                           <div>Email:  <CopyText className="ml-3" text="Jackson.Ingram3@p8b.com" /></div>
                           <div>Password:  <CopyText className="ml-3" text=" As!2" /></div>
                        </RF>
                     }
                  />
                  <Card className="m-2"
                     imgSrc="/public/images/projectPics/portfolio.png"
                     imgHref="https://p8b.uk"
                     imgAlt="Project1"
                     body={
                        <RF>
                           <p className="text-justify" children="My online portfolio. This website uses NodeJS to serve the react application and ASP.NET Core 3.1 for the back-end API which powers the contact me page." />
                           <p className="text-justify" children="Technologies: .Net CORE 3.1, ReactJS, Redux, TypeScript HTML, CSS/SASS, NodeJS and MS SQL." />
                        </RF>}
                     footer={
                        <RF>
                           <div className="text-center mb-2">
                              <a className="col github font-0" children="G" target="_blank" href="https://github.com/p8b/p8b.uk" rel="noopener" />
                           </div>
                        </RF>
                     }
                  />
                  <Card className="m-2"
                     imgSrc="/public/images/projectPics/idea.jpg"
                     imgHref="/Contact"
                     imgAlt="Project1"
                     header={
                        <RF>
                           <p className="text-center" children="Do you have an application idea?" />
                           <p className="text-center" children="Do you have an interesting job offer?" />
                        </RF>
                     }
                     body={
                        <RF>
                           <p className="text-center" children="Then get in touch and let's have a chat." />
                        </RF>}
                     footer={
                        <RF>
                           <div className="col-12 text-center mb-2 mt-5">
                              <Link to="/Contact" className="btn-lg btn-yale col-12" children="Let's Talk" />
                           </div>
                        </RF>
                     }
                  />
               </div>
               <div className="col-12 text-center bg-white pt-5 pb-5 mt-5">
                  <div className="h1" children="Thank you for your visit." />
               </div>
            </div>
         </Container >
      );
   }
}
declare type IMyState = {
   messege: string,
   msgTimer: number,
   iconTimer: number,

};
declare type IProps = {

};
export default connect(
   (state: IReduxStoreState) => {
      return {

      };
   },
   dispatch => bindActionCreators({}, dispatch)
)(Home);
