/** @format */

'use client';

// import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }) => (
	<div session={session}>{children}</div>
);

export default Provider;
