import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PurifyComponent } from 'p8b.core.ts/src/components/Class.Extensions';
import { IReduxStoreState } from '../reducers';
export class CopyText extends PurifyComponent<IProps> {
   myState = {
      isCopied: false
   };
   constructor(props: IProps) {
      super(props);
      this.copy = this.copy.bind(this);
   }
   copy() {
      navigator.clipboard.writeText(this.props.text);
      this.reRender(() => this.myState.isCopied = true);
      const timer = setInterval(() => {
         this.reRender(() => this.myState.isCopied = false);
         clearInterval(timer);
      }, 2000);
   }
   render() {
      return (
         <div className={`custom-tooltip ${this.props.className || ""}`}
            onClick={this.copy}>
            {this.props.text}
            <span id="myToolTip"
               className="custom-tooltiptext"
               children={this.myState.isCopied ? "Copied" : "Copy"} />
         </div>
      );
   }
}
declare type IProps = {
   text: string;
   className?: string;
};
export default connect(
   (state: IReduxStoreState) => {
      return {
      };
   },
   dispatch => bindActionCreators({
   }, dispatch)
)(CopyText);

