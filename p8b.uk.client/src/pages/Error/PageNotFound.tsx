import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getSilentAuthentication } from "../../actions/AuthenticationAction";

import "./canvas.css";
import { Circle, MousePos } from "./CanvasHelper";
import { IReduxStoreState } from "../../reducers";
import { Container } from "../../components/Container";
import { PurifyComponent } from "p8b.core.ts/src/components/Class.Extensions";
import { PageHeader } from "p8b.components.react/src/components/Texts/_index";

declare type IMyState = {
   canvas: React.RefObject<HTMLCanvasElement>;
   timer: NodeJS.Timeout;
   circle: Circle;
   mousePos: MousePos;
};
class PageNotFound extends PurifyComponent<Props> {
   myState: IMyState = {
      canvas: React.createRef(),
      timer: setInterval(() => {
         //this.onloadCanva();
      }, Math.RandomInteger(100, 100)) as unknown as NodeJS.Timeout,
      circle: new Circle(),
      mousePos: new MousePos()
   };
   constructor(props: Props) {
      super(props);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.resetCanvas = this.resetCanvas.bind(this);
   }
   componentWillUnmount() {
      clearInterval(this.myState.timer);
      this.myState.canvas.current?.removeEventListener("mousemove", this.onMouseMove);
      this.myState.canvas.current?.removeEventListener("resize", this.resetCanvas);
   }
   componentDidMount() {
      this.myState.canvas.current?.addEventListener("mousemove", (event: globalThis.MouseEvent) => this.onMouseMove(event));
      this.myState.canvas.current?.addEventListener("resize", this.resetCanvas);
      this.onloadCanva();
   }
   onMouseMove(event: globalThis.MouseEvent) {
      this.myState.mousePos.x = event.offsetX;
      this.myState.mousePos.y = event.offsetY;
   }
   resetCanvas() {
      clearInterval(this.myState.timer);
      this.onloadCanva();
   }
   onloadCanva() {
      const c = this.myState.canvas.current?.getContext("2d");
      c!.canvas.width = window.innerWidth;
      //c!.canvas.width = stringToNumber((window.innerWidth / 1.3).toFixed(2));
      c!.canvas.height = window.innerHeight;
      //c!.canvas.height = stringToNumber((window.innerHeight / 2).toFixed(2));
      var numOfCircles = window.innerWidth / 5;
      var circles: Circle[] = [];
      for (var i = 0; i < numOfCircles; i++) {
         const rd = Math.RandomInteger(7, 10);
         let cr = new Circle(
            Math.RandomInteger(0, (c!.canvas.width - rd) + rd),
            Math.RandomInteger(0, c!.canvas.height - rd) + rd,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            rd,
            `rgba(${Math.RandomInteger(0, 255)}, ${Math.RandomInteger(0, 255)}, ${Math.RandomInteger(0, 255)}, ${Math.RandomInteger(1, 1)})`,
            `rgba(${Math.RandomInteger(0, 120)}, ${Math.RandomInteger(0, 120)}, ${Math.RandomInteger(0, 120)}, ${Math.RandomInteger(1, 1)})`
         );
         circles.push(cr);
      }
      this.myState.timer = setInterval(() => this.reRender(() => {
         if (window.innerWidth !== c?.canvas.width)
            c!.canvas.width = window.innerWidth;
         if (window.innerHeight !== c?.canvas.height)
            c!.canvas.height = window.innerHeight;
         c?.clearRect(0, 0, c!.canvas.width, c!.canvas.height);
         circles.map(cir => {
            let msRd = 100;
            if (document.getElementById("mainBody")?.classList.contains("dark-theme")) {
               cir.fillColor = cir.fillColorLight;
            } else {
               cir.fillColor = cir.fillColorDark;
            }

            if ((cir.x > (this.myState.mousePos.x! - msRd) && cir.x < (this.myState.mousePos.x! + msRd)) &&
               (cir.y > (this.myState.mousePos.y! - msRd) && cir.y < (this.myState.mousePos.y! + msRd))) {
               cir.radius = cir.radiusOrg * 5;
            }
            else {
               cir.radius = cir.radiusOrg;
            }
            if (cir.randomNum >= 5)
               cir.drawGravity(c);
            else
               cir.drawSpace(c);
         });
      }), 30) as unknown as NodeJS.Timeout;
   }
   render() {
      return (
         <Container className="custom-container row p-0 m-0"   >
            <PageHeader children="Page Not Found"
               className="col-12 ml-auto mr-auto text-center" />
            <canvas ref={this.myState.canvas}
               className="canvas1"
               onClick={() => { this.resetCanvas(); }}
            />
         </Container>
      );
   }
}

declare type Props = {
   getSilentAuthentication: any;
};
export default connect(
   (state: IReduxStoreState) => {
      return {
         Authentication: state.Authentication
      };
   },
   dispatch => bindActionCreators({
      getSilentAuthentication
   }, dispatch)
)(PageNotFound);
