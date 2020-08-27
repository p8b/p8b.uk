import React, { CSSProperties } from 'react';

export const PageHeader = (props: IProps) => {
   const style: CSSProperties = {
      fontFamily: '"Antonio", Verdana, sans - serif',
      fontSize: '40px',
      fontWeight: 500,
      lineHeight: '1.5',
      marginBottom: '1rem',
   };
   return (
      <div id={props.id} style={style} className={props.className} children={props.children || props.title} />
   );
};

interface IProps {
   id?: string;
   className?: string;
   title?: any;
   children?: any;
   disabled?: boolean;
}
