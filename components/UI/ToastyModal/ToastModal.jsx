import Backdrop from "../Backdrop/Backdrop";
import "./ToastModal.css";

const Modal = (props) => {
  let attachedClasses = ["Toast-Modal", "Toast-Modal-Close"];
  if (props.show) {
      attachedClasses = ["Toast-Modal", "Toast-Modal-Open"];
  }

  return (
    <div>
        <div className={attachedClasses.join(" ")}>
        <div className={props?.status === "success" ?  "Toast-modal-header bg-lime-500 text-white" : "modal-body bg-red-400 text-white"}>
            <span className="cursor-pointer pl-2 pr-2" onClick={props.closeModal}>
              X
            </span>
          </div>
         <div className={props?.status === "success" ? "Toast-modal-body bg-lime-500 text-white pb-5" : "modal-body bg-red-400 text-white pb-5" }>{props.children}</div>
        </div>
    </div>
  )
}

export default Modal
