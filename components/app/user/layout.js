/** @format */

import "@styles/global.css";

import Nav from "@components/Nav";

export const metadata = {
	title: "Developer Portal",
	description: "Developer Portal",
};

const AuthLayout = ({ children }) => {
	return (
		<main className="mt-28">
			<Nav />
			{children}
		</main>
	);
};

export default AuthLayout;
