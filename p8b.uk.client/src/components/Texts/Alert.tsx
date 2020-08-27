import React, { CSSProperties } from 'react';
import { AlertTypes } from '../../core/constant.Variables';
import { Error, AlertObj } from '../../core/appClasses';

export const Alert = (props: IProps) => {
   let bgColor = 'rgb(0, 0, 0)';
   let textColor = 'black';
   switch (props.alert!.Type) {
      case AlertTypes.Warning:
         bgColor = 'rgb(255, 221, 70)';
         textColor = 'black';
         break;
      case AlertTypes.Error:
         bgColor = 'rgb(135, 35, 35)';
         textColor = 'white';
         break;
      case AlertTypes.Success:
         bgColor = 'rgb(35, 135, 62)';
         textColor = 'white';
         break;
      default:
         break;
   }
   let style: CSSProperties = {
      'backgroundColor': bgColor,
      'fontWeight': 600,
      'color': textColor,
      'padding': '5px',
   };
   let output = <></>;
   if (props.alert!.List.length > 0)
      output =
         <div className={"p-0 m-0 mt-2 mb-2 " + props.className}>
            <div style={style} className="row col-12 m-0">
               <div className="col-11"
                  children={props.alert!.List.map((error: Error) => <div key={error.key} children={error.value} />)}
               />
               <div className="col-1 p-0 pr-2 text-right"
                  children={<a onClick={props.onClosed} children="✘" />}
               />
            </div>
         </div>;
   return (output);
};

interface IProps {
   className?: string;
   alert?: AlertObj;
   onClosed?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}