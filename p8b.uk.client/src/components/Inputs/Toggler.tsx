import React from 'react';

export const Toggler = (props: IProps) => {
   const key: string = props.keyVal ? props.keyVal : Math.random().toString();
   return (
      <div className={`toggler ${props!.className!}`}
      >
         <div onClick={() => document.getElementById(`${key}`)?.click()}>
            <input type="checkbox" id={key} required={props!.required}
               defaultChecked={props.defaultChecked ?? false}
               onChange={i => {
                  const lbl = document.getElementById(`lbl${key}`);
                  if (props.lblValue != null || props.lblAltValue != null)
                     i.target.checked ? lbl!.innerHTML = (props.lblAltValue || props.lblValue) : lbl!.innerHTML = (props.lblValue || props.lblAltValue);
                  props!.onChange!(i.target.checked);
               }}
               disabled={props!.disabled} />
            <span />
         </div>
         <label id={`lbl${key}`}
            onClick={() => document.getElementById(`${key}`)?.click()}
            className={`${props.lblClassName || ""}`}
            children={(props.defaultChecked ? (props.lblAltValue ?? "") : (props.lblValue ?? "")) ?? ""} />
      </div>
   );
};

declare type IProps = {
   keyVal?: string;
   defaultChecked?: boolean;
   className?: string;
   required?: boolean;
   disabled?: boolean;
   lblValue?: any;
   lblAltValue?: any;
   lblClassName?: string;
   onChange?: (checked: boolean) => void;
};
