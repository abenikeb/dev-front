/** @format */

import "@styles/global.css";
import "@styles/guest.css";
import "@styles/user.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Provider from "@components/Provider";
import Nav from "@components/Nav";

export const metadata = {
	title: "Developer Portal",
	description: "Developer Portal",
};

const RootLayout = ({ children }) => (
	<html lang="en">
		<link rel="icon" href="/icon.png" />
		<body>
			<div className="main">
				<div className="gradient" />
			</div>

			<main className="app">
				<Nav />

				{children}
			</main>
		</body>
	</html>
);

export default RootLayout;
