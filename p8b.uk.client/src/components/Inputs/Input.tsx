import React from 'react';

export const Input = (props: IProps) => {
   const id: string = props.id ? props.id : Math.random().toString();

   const validationClassName = (targetInput: EventTarget & HTMLInputElement) => {
      const regex = RegExp(props.validationPattern ?? "");
      targetInput.classList.remove("class", "default");
      targetInput.classList.remove("class", "valid");
      targetInput.classList.remove("class", "danger");

      if (targetInput.value.ReplaceAll(" ", "") === "")
         targetInput.classList.add("default");
      else if (regex.test(targetInput.value))
         targetInput.classList.add("valid");
      else
         targetInput.classList.add("danger");
   };

   return (
      <div className={`pb-3 ${props.className}`} key={props.keyVal}>
         {!props.lblDisabled &&
            <label children={props.lblText} htmlFor={id}
               className={"col-form-label p-0 m-0 " + props.lblClassName} />
         }
         <input id={id} type={props.type || "text"}
            className={`${props.showDanger == true ? "danger" : ""} ${props.inputClassName}`}
            defaultValue={props.value}
            placeholder={props.placeholder}
            accept={props.accept}
            onChange={i => {
               props.onChange!(i);
               props.validationPattern ?? validationClassName(i.target);
            }}
            onBlur={props.onBlur}
            disabled={props.disabled || false}
            onKeyDown={e => e.key === 'Enter' ? props?.enterPressed : ""}
         />
      </div>
   );
};

interface IProps {
   keyVal?: string;
   id?: string;
   showDanger?: boolean;
   type?: string;
   className?: string;
   value?: string | number;
   placeholder?: string;
   accept?: string;
   disabled?: boolean;
   validationPattern?: string;
   lblClassName?: string;
   lblText?: string;
   lblDisabled?: boolean;
   inputClassName?: string;
   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
   onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
   enterPressed?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
