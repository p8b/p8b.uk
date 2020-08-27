import React from 'react';

export const CheckBox = (props: IProps) => {
   const key: string = props.keyVal ? props.keyVal : Math.random().toString();
   return (
      <>
         <input type="checkbox" id={key}
            className={`checkbox ${props?.className}`}
            onChange={i => props!.onChange!(i.target.checked)}
            required={props?.required}
            disabled={props?.disabled} />
         <label className={props?.lblclassName || ''}
            children={props?.lblValue}
            htmlFor={key} />
      </>
   );
};

declare type IProps = {
   keyVal?: string;
   className?: string;
   required?: boolean;
   disabled?: boolean;
   lblValue?: any;
   lblclassName?: string;
   onChange?: (checked: boolean) => void;
};
