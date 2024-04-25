import Backdrop from "../Backdrop/Backdrop";
import "./DashboardSideNav.css";
import Image from "next/image";

const DashboardSideNav = (props) => {
  let attachedClasses = ["DashboardSideNav-Modal", "DashboardSideNav-Modal-Close"];
  if (props.show) {
    attachedClasses = ["DashboardSideNav-Modal", "DashboardSideNav-Modal-Open"];
  }

  return (
    <div>
      {/* <Backdrop show={props.show} clicked={props.closeModal} /> */}
      <div className={attachedClasses.join(" ")}>
        <div className="DashboardSideNav-modal-header">
          <div className='flex bg-slate-300 h-20 items-center rounded-tl-xl rounded-bl-xl absolute top-80 right-0 shadow-sm border border-gray-200'>
            <div>
              <Image
                src="/assets/icons/right.png"
                width={20}
                height={20}
                className='rounded-full rotate-180'
                alt='profile'
                onClick={props.closeModal}
              />
            </div>
          </div>
        </div>
        <div className="DashboardSideNav-modal-body">{props.children}</div>
        <div className="DashboardSideNav-modal-footer"></div>
      </div>
    </div>
  )
}

export default DashboardSideNav
