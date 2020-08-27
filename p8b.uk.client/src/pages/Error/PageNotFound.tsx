import React, { useState, useEffect } from "react";
import "./canvas.css";
import { Circle, MousePos } from "./CanvasHelper";
import Container from "../../components/Container";
import { PageHeader } from "../../components/Texts/PageHeader";

declare type IMyState = {
   canvas: React.RefObject<HTMLCanvasElement>;
   timer: NodeJS.Timeout;
   circle: Circle;
   mousePos: MousePos;
};
const PageNotFound = () => {
   const canvas = React.createRef<HTMLCanvasElement>();
   let timer = 0;
   //const [circle, setCircle] = useState(new Circle());
   const [mousePos, setMousePos] = useState(new MousePos());

   useEffect(() => {
      canvas.current?.addEventListener("mousemove", (event: any) => onMouseMove(event));
      canvas.current?.addEventListener("resize", resetCanvas);
      onloadCanva();
      return () => {
         clearInterval(timer);
         canvas.current?.removeEventListener("mousemove", onMouseMove);
         canvas.current?.removeEventListener("resize", resetCanvas);
      };

   }, []);
   const onMouseMove = (event: any) => {
      setMousePos({ x: event.offsetX, y: event.offsetY });
      //mousePos.x = event.offsetX;
      //mousePos.y = event.offsetY;
   };
   const resetCanvas = () => {
      clearInterval(timer);
      onloadCanva();
   };
   const onloadCanva = () => {
      const c = canvas.current?.getContext("2d");
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
      timer = setInterval(() => {
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

            if ((cir.x > (mousePos.x! - msRd) && cir.x < (mousePos.x! + msRd)) &&
               (cir.y > (mousePos.y! - msRd) && cir.y < (mousePos.y! + msRd))) {
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
      }, 30) as unknown as number;
   };
   return (
      <Container className="custom-container row p-0 m-0"   >
         <PageHeader children="Page Not Found"
            className="col-12 ml-auto mr-auto text-center" />
         <canvas ref={canvas}
            className="canvas1"
            onClick={() => { resetCanvas(); }}
         />
      </Container>
   );
};

export default PageNotFound;