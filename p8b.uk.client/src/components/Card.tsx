import React from 'react';
import { Divider } from './Divider';
import { RF } from 'p8b.components.react/src/components/PureElements/RF';
export const Card = (props: IProps) => {
   return (
      <div className={`col-11 col-sm-6 col-md-4 col-lg-3 text-left bg-white shadow-all ${props.className ?? ""}`}>
         {props.imgSrc != null && props.imgHref == null && <img className="custom-card-img" src={props.imgSrc} alt={props.imgAlt || "Card"} />}
         {props.imgSrc != null && props.imgHref != null && <a href={props.imgHref} rel="noopener" target="_blank" > <img className="custom-card-img" src={props.imgSrc} alt={props.imgAlt || "Card"} /></a>}
         <div className="pl-4 pr-4 pb-4 pt-2">
            {props.header != null &&
               <RF>
                  {props.header}
                  <Divider />
               </RF>
            }
            <div className="mt-2 mb-2" children={props.body} />
            {props.footer != null &&
               <RF>
                  <Divider />
                  {props.footer}
               </RF>
            }
         </div>
      </div>
   );
};

declare type IProps = {
   className?: string;
   imgSrc?: string;
   imgAlt?: string;
   imgHref?: string;
   header?: any;
   body?: any;
   footer?: any;
};
