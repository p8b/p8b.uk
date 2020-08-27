import React, { useEffect } from 'react';

const Modal = (props: IProps) => {
   let toggleContainerModal = React.createRef<HTMLDivElement>();

   useEffect(() => {
      window.addEventListener("mousedown", onClickOutsideHandler);
      return window.removeEventListener("mousedown", onClickOutsideHandler);
   }, []);
   const onClickOutsideHandler = (event: any) => {
      if (!props?.isForceOn && toggleContainerModal.current === event.target)
         props.onClose();
   };

   if (props.isOpen)
      document.getElementsByTagName("footer")[0]?.classList.add("footer-behind");
   else
      document.getElementsByTagName("footer")[0]?.classList.remove("footer-behind");

   return (
      <>
         {props.isOpen && <div className="modal-backdrop show" />}
         <div tabIndex={-1}
            className={`modal m-auto ${props.isOpen ? ' show d-block ' : " d-none "} ${props!?.className}`}
            children={
               <div className="row h-100 " ref={toggleContainerModal}>
                  <div className={`col-11 col-sm-10 col-md-8 col-lg-6 m-auto bg-solid bg-white p-3 modal-body ${props.bodyClassName}`} >
                     {props.isOpen && props.children}
                  </div>
               </div>
            }
         />
      </>
   );
};

interface IProps {
   children: any;
   bodyClassName?: string;
   className?: string;
   isOpen: boolean;
   isForceOn?: boolean;
   onClose: () => void;
}
export default Modal;
