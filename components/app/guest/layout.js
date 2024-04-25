/** @format */

import "@styles/global.css";
// import Loading from '@components/UI/miniLoading';
import { MiniLoading } from "@components/UI/miniLoading";

export const metadata = {
	title: "Developer Portal",
	description: "Developer Portal",
};

const GuestLayout = ({ children }) => {
	return (
		<>
			<MiniLoading />
			<section className="flex-center">{children}</section>
		</>
	);
};

export default GuestLayout;
