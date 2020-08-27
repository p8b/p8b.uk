import React from 'react';

export const Button = (props: IProps) =>
   <button key={Math.random()} type="button" children={props.children}
      className={"btn " + props?.className}
      onClick={props.onClick}
      disabled={props?.disabled || false}
   />;


declare type IProps = {
   children?: any;
   className?: string;
   disabled?: boolean;
   onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};


