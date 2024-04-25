import React from "react";

const DisplayHTMLContent = ({ htmlContent }) => {
	return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default DisplayHTMLContent;
