/** @format */

import Image from "next/image";

const handleCopy = () => {
	textRef.current.select();
	document.execCommand("copy");
};
const ApiKey = (props) => {
	return (
		<div className="keys">
			<div className="api-key">
				<div>
					<div className="key-value">
						<h1>Merchant AppId : </h1>
						<p>#####-#####-#####-#####</p>
					</div>
					<div className="key-value">
						<h1>Fabric App ID : </h1>
						<p>#####-#####-#####-#####-##</p>
					</div>
					<div className="key-value">
						<h1>ShortCode : </h1>
						<p>#####-#####-#####-#####-####</p>
					</div>
				</div>
			</div>
			<div className="api-key">
				<div className="key-value">
					<h1>PrivateKey : </h1>
					<p>#####-#####-#####-#####</p>
				</div>
				<div className="key-value">
					<h1>Public Key : </h1>
					<p>#####-#####-#####-#####</p>
				</div>
				<button className="card__button">Get API Key</button>
			</div>
		</div>
	);
};

export default ApiKey;
