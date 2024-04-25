import "./Backdrop.css";

const Backdrop = ({ show, clicked }) => {
  return (
    <div>
      {show ? <div onClick={clicked} className="Backdrop"></div> : null}
    </div>
  );
};

export default Backdrop;
