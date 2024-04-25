import Backdrop from "@components/UI/Backdrop/Backdrop";
import "./MockModal.css";
import { useEffect, useState } from "react";

const MockModal = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  let attachedClasses = ["Mock-Modal", "Mock-Modal-Close"];
  if (props.show) {
      attachedClasses = ["Mock-Modal", "Mock-Modal-Open"];
  }

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 5000)
  },[])

  return (
    <div>
      <Backdrop show={props.show} clicked={props.closeModal} />
      <div className={attachedClasses.join(" ")}>
        {isLoading ? <span className="loading loading-spinner text-lime-500"></span> :
          <div className="mockup-phone">
          <div className="camera"></div> 
          <div className="display">
            <div className="artboard artboard-demo phone-1">
              <div className="Mock-modal-body">{props.children}</div>
            </div>
          </div>
        </div> }
        
      </div>
    </div>
  )
}

export default MockModal
