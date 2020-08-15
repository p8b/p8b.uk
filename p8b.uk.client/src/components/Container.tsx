import React, { PureComponent } from "react";

export class Container extends PureComponent<IProps> {
   componentDidMount() {
      if (this.props.extendBottom) {
         let containers = document.getElementsByClassName("extend-container");
         for (var i = 0; i < containers.length; i++) {
            (containers[i] as HTMLElement).style.marginBottom = `${document.getElementById("footer")!.clientHeight}px`;
         }
      }
   }
   render() {
      return <div className={`container ${this.props.extendBottom ? "extend-container" : ""} ${this.props?.className}`} children={this.props?.children} ref={this.props?.ref} />;
   }
}

interface IProps {
   children?: any;
   className?: string;
   ref?: any;
   extendBottom?: boolean;
}