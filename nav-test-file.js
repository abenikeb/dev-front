/** @format */

"use client";

import Link from "next/link";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from 'next/navigation';
import Button from "./UI/Button/Button";

import { getUserData, logout } from "../app/api-services/authService";
import ProtectedRoute from "./ProtectedRoute";

const navLink = [
	{ title:"HOME",  path:"/user/home", isProtectedRoute: true},
	{ title: "APIS", path: "/user/apis", isProtectedRoute: true },
	{ title: "DOCS", path: "http://developer.ethiotelecom.et/docs/GettingStarted", isProtectedRoute:false, isPathNew:true },
	{ title: "FAQS", path: "/user/faqs", isProtectedRoute: false },
	{ title:"FORUM", path:"/user/forum", isProtectedRoute: false},
	{ title: "SUPPORT", path: "/user/support", isProtectedRoute: false },
]

const Nav = () => {
	const router = useRouter();

	const pathname = usePathname();
	const [isUserLogin, setIsUserLogin] = useState(false);
	const [user, setUser] = useState(null);

	const [isdropDownToggle, setIsDropdownToggle] = useState(false)
	const [isSettingdropDownToggle, setIsSettingDropdownToggle] = useState(false)
	const [isNotificationdropDownToggle, setIsNotificationDropdownToggle] = useState(false)

	useEffect(() => {
		const user = getUserData(); //{username: 'ebsaTeklu', sub: 'ebsa16teklu@gmail.com', iat: 1685207877, exp: 1685213877}
		setUser(user);

		user !== null ? setIsUserLogin(true) : setIsUserLogin(false);
	}, []);

	const handleSignOut = () => {
		logout();
		router.replace("/");
	};

	return (
		<nav className="top-nav glassmorphism drop-shadow-md border-b-2 border-lime-500">
			{/* Logo section */}
			<div className="w-64 sm:h-full  bg-white rounded-tr-3xl flex justify-center items-center">
				<Link href="/">
					<Image
						src="/assets/images/et-logo-2.svg"
						alt="logo"
						width={160}
						height={150}
						className="object-contain"
					/>
				</Link>
			</div>

			{/* Navigation Links*/}
			<div className="flex gap-12">
				<ul className="flex justify-center items-center gap-10">
					{navLink.map((link) => (
						<li key={link.title}>
							<Link href={(link.isProtectedRoute && !isUserLogin) ? '/guest/login' : link.path  } target={link.isPathNew && "_blank"} className={`font-bold mb-9 hover:text-amber-300 ${pathname === link.path && 'text-amber-400 font-sans contrast-125'}`} prefetch={false}>
								{link.title}
							</Link>
						</li>		
					))}
				</ul>		
			</div>
			
			{/* Profile */}
			<div className="w-1/3 h-full flex flex-row gap-x-3 justify-between items-center">
				<div>
					{!isUserLogin ? (
							<div className="flex flex-0 gap-3 md:gap-5">
								<Link href="/guest/login">
								    <Button btn_class="btn-outline" label="Login"/>
								</Link>
							</div>
						) : (
							<div className="flex flex-0 flex-row gap-4 items-center justify-between">
								<div className="dropdown-wrap-user">
									<Image
										src="/assets/icons/profile-user.svg"
										width={15}
										height={15}
										alt="user"
										className="text-white cursor-pointer"
										onClick={() => setIsDropdownToggle(!isdropDownToggle)}
									/>
									{isdropDownToggle &&
										<ul className="fixed top-20 right-1/3 p-2 shadow bg-base-100 rounded-md w-52 text-black gap-y-2">
												<li onClick={() => setIsDropdownToggle(false)}>
													<Link href="/user/profile" className="text-sm font-bold text-gray-700 flex flex-row gap-x-2 mb-2">
														<Image
															src="/assets/icons/profile-user-circle.svg"
															width={20}
															height={20}
															alt="user"
															className=""								
														/>
														{user?.firstName + " " + user?.lastName}
													</Link>
												</li>
												<hr />
											<li className="mt-2 pl-5 font-semibold" onClick={() => setIsDropdownToggle(false)}><Link href="/user/profile">Profile</Link></li>			
										</ul>
									}
									
								</div>

								<div className="dropdown-wrap-settings">
								
									<Image
										src="/assets/icons/profile-setting.svg"
										width={20}
										height={20}
										alt="user"
										className="text-white cursor-pointer"
										onClick={() => setIsSettingDropdownToggle(!isSettingdropDownToggle)}
									/>
									{
										isSettingdropDownToggle &&
										<ul tabIndex={0} className="fixed top-20 right-1/3 p-2 shadow bg-base-100 rounded-md w-52 text-black gap-y-2">
												<li onClick={() => setIsSettingDropdownToggle(false)}>
													<Link href="/user/profile" className="text-sm font-bold text-gray-700 flex flex-row gap-x-2 mb-2">
														
													</Link>
												</li>
												<hr />
												<li className="mt-2 pl-5 font-semibold" onClick={() => setIsSettingDropdownToggle(false)}><Link href="/user/profile">Setting</Link></li>
										</ul>
									}
									
								</div>

								<div className="dropdown-wrap-notification">
									<Image
										src="/assets/icons/profile-notification.svg"
										width={20}
										height={20}
										alt="user"
										className="text-white cursor-pointer"
										onClick={() => setIsNotificationDropdownToggle(!isNotificationdropDownToggle)}
									/>
									
									{
										isNotificationdropDownToggle &&
										<ul tabIndex={0} className="fixed top-20 right-1/3 p-2 shadow bg-base-100 rounded-md w-52 text-black gap-y-2">
												<li onClick={() => setIsNotificationDropdownToggle(false)}>
													<Link href="/user/profile" className="text-sm font-bold text-gray-700 flex flex-row gap-x-2 mb-2">
														Notification Section
													</Link>
												</li>
												<hr />
												<li className="mt-2 pl-5 font-semibold text-sm text-gray-300" onClick={() => setIsNotificationDropdownToggle(!isNotificationdropDownToggle)}><Link href="/user/profile">
													Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
												</Link>
												</li>
										</ul>
									}
									
								</div>
					
								<div className="w-28">
									<Button onBtnAction={handleSignOut} btn_class="btn-outline" label="Sign Out"></Button>
								</div>
							</div>
						)}
				</div>

				<div className="bg-white rounded-tl-3xl flex flex-0 justify-center items-center h-full w-60">
					<Link href="/">
						<Image
							src="/assets/images/telebirr-logo-color.svg"
							alt="logo"
							width={160}
							height={160}
							className="object-contain"
						/>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Nav;
