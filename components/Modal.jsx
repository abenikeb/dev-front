import { useEffect } from "react";
const Modal = (props) => {
  useEffect(() => {
    props.tshowPopup && document.getElementById("my_modal_4").showModal();
  }, []);
  const closeModal = () => {
    // //console.log("closeMOdal triggered");
    props.onCloseModel();
  };

  return (
    <>
      {/* <button
        className="btn"
        // onClick={() => document.getElementById("my_modal_4").showModal()}
      >
        open modal
      </button> */}
      {props.tshowPopup && (
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box">
            {/* <form method="dialog"> */}
            {/* if there is a button in form, it will close the modal */}
            <div className="modal-action">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>
            {/* </form> */}
            <h3 className="font-bold text-lg">{props.title}</h3>
            <p className="py-4">{props.description}</p>
          </div>
        </dialog>
      )}
    </>
  );
};
export default Modal;
