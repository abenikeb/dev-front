import Backdrop from "../Backdrop/Backdrop";
import "./Modal.css";

const Modal = (props) => {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.show !== this.props.show ||
  //     nextProps.children !== this.props.children
  //   );
  // }

  let attachedClasses = ["Modal", "Modal-Close"];
    if (props.show) {
      attachedClasses = ["Modal", "Modal-Open"];
  }

  return (
    <div>
        <Backdrop show={props.show} clicked={props.closeModal} />
        <div className={attachedClasses.join(" ")}>
          <div className="modal-header">
            <h3>New Forum Topic</h3>
            <span onClick={props.closeModal}>
              x
            </span>
          </div>
          <div className="modal-body">{props.children}</div>
          <div className="modal-footer"></div>
        </div>
    </div>
  )
}

export default Modal
