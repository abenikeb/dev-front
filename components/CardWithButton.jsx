import React from "react";

const CardWithButton = ({
  title,
  description,
  button_title,
  image_link,
  image_alt,
  handleButtonClick,
}) => {
  return (
    <>
      <div className="card w-[97%] bg-base-100 shadow-xs border-none mx-auto">
        {image_link ? (
          <figure>
            <img src={image_link} alt={image_alt} />
          </figure>
        ) : (
          ""
        )}
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end">
            {button_title ? (
              <button className="btn" onClick={handleButtonClick}>
                {button_title}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default CardWithButton;
