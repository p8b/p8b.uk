import React from 'react';
export const Divider = (props: IProps) => <div className={`section-divider ${props.className}`} />;
declare type IProps = {
   className?: string;
};
