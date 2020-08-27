import React from 'react';

export const Row = (props: IProps) =>
   <div className={`row ${props.className || ''}`}
      children={props?.children} ref={props?.ref} />;

declare type IProps = {
   children?: any;
   className?: string,
   ref?: React.RefObject<HTMLDivElement>;
};