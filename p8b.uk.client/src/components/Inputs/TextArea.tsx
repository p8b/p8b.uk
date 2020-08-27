import React from 'react';

export const TextArea = (props: IProps) => {
   const id: string = props.id ? props.id : Math.random().toString();
   const validationClassName = (targetInput: EventTarget & HTMLTextAreaElement) => {
      const regex = RegExp(props.validationPattern ?? "");
      targetInput.classList.remove("class", "default");
      targetInput.classList.remove("class", "valid");
      targetInput.classList.remove("class", "danger");

      if (targetInput.value.replace(" ", "") === "")
         targetInput.classList.add("default");
      else if (regex.test(targetInput.value))
         targetInput.classList.add("valid");
      else
         targetInput.classList.add("danger");
   };
   return (
      <div className={props.className} key={props.keyVal}>
         {!props.lblDisabled &&
            <label htmlFor={id}
               className={"col-form-label " + props?.lblclassName}
               children={props.lblText} />
         }
         <textarea value={props.value} id={id}
            placeholder={props.placeholder}
            onChange={i => {
               props.onChange!(i);
               props.validationPattern ?? validationClassName(i.target);
            }}
            rows={props.rows}
            disabled={props.disabled}
            className={`form-control ${props.showDanger === true ? "danger" : ""} ${props.inputClassName}`}
         />
      </div>
   );
};

declare type IProps = {
   keyVal?: string;
   id?: string;
   className?: string;
   inputClassName?: string;
   value?: string;
   placeholder?: string;
   showDanger?: boolean;
   rows: number;
   disabled?: boolean;
   lblclassName?: string;
   lblText?: string;
   lblDisabled?: boolean;
   validationPattern?: string;
   onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};