/** @format */
"use client";

import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Dropdown, Menu, Button } from "antd";
import {
  UserOutlined,
  BellOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import ProfileSidenav from "./UI/ProfileSidenav/ProfileSidenav";
import { getUserData, logout } from "../app/api-services/authService";

const navLink = [
  {
    title: "Home",
    path: "/user/home",
    icon: "/assets/icons/mobile-home.svg",
    isProtectedRoute: true,
  },
  {
    title: "Tools",
    path: "/user/product",
    icon: "/assets/icons/mobile-docs.svg",
    isProtectedRoute: true,
  },
  {
    title: "API",
    path: "/user/apis",
    icon: "/assets/icons/mobile-api.svg",
    isProtectedRoute: true,
  },
  {
    title: "Doc",
    path: "https://developer.ethiotelecom.et/docs/",
    icon: "/assets/icons/mobile-docs.svg",
    isProtectedRoute: false,
    isPathNew: true,
  },
  {
    title: "FAQ",
    path: "/user/faqs",
    icon: "/assets/icons/mobile-faq.svg",
    isProtectedRoute: false,
  },
  {
    title: "Forum",
    path: "/user/forum",
    icon: "/assets/icons/mobile-forum.svg",
    isProtectedRoute: false,
  },
  {
    title: "Team",
    path: "/user/team",
    icon: "/assets/icons/mobile-api.svg",
    isProtectedRoute: true,
  },
];

const Nav = () => {
  const router = useRouter();

  const [settingsDropdownVisible, setSettingsDropdownVisible] = useState(false);
  const [notificationDropdownVisible, setNotificationDropdownVisible] =
    useState(false);

  const pathname = usePathname();

  const [isUserLogin, setIsUserLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    const user = getUserData();
    setUser(user);

    user !== null ? setIsUserLogin(true) : setIsUserLogin(false);
  }, []);

  const handleSignOut = () => {
    logout();
    router.replace("/guest/login");
    window.location.reload();
  };

  const handleModalClose = () => {
    setViewModal(false);
  };

  const handleModalOpen = () => {
    setViewModal(true);
  };

  const handleSettingsMenuClick = (e) => {
    if (e.key === "profile") {
      router.push("/user/profile");
    } else if (e.key === "settings") {
      // router.push("/user/settings");
      router.push("/user/home");
    }
    setSettingsDropdownVisible(false);
  };

  const handleNotificationMenuClick = () => {
    setNotificationDropdownVisible(false);
  };

  const menu = (
    <Menu onClick={handleSettingsMenuClick}>
      <Menu.Item key="profile">
        <Link
          href="/user/profile"
          className="text-sm font-bold text-gray-700 flex flex-row gap-x-2 mb-2"
        >
          <Image
            src="/assets/icons/profile-user-circle.svg"
            width={20}
            height={20}
            alt="user"
          />
          {user?.firstName} {user?.lastName}
        </Link>
      </Menu.Item>
      <Menu.Divider />
      {/* <Link href="/user/settings">Settings</Link> */}
      {/* <Menu.Item key="settings" className="mt-2 pl-5 font-semibold">
        <Link href="/user/home">Settings</Link>
      </Menu.Item> */}
    </Menu>
  );

  const notificationMenu = (
    <Menu onClick={handleNotificationMenuClick}>
      <Menu.Item className="mt-2 pl-5 font-semibold text-sm text-gray-300">
        {/* <Link href="/user/notifications">Coming Soon!</Link> */}
        {/* <Link href="/user/home">Coming Soon!</Link> */}
      </Menu.Item>
    </Menu>
  );

  const ProfileSideNav = (
    <div className="font-bold">
      <ul className="flex flex-col justify-start items-start text-black">
        {navLink.map((link) => (
          <li key={link.title} onClick={handleModalClose}>
            <Link
              href={
                link.isProtectedRoute && !isUserLogin
                  ? "/guest/login"
                  : link.path
              }
              target={link.isPathNew && "_blank"}
              className={`font-semibold flex gap-x-5 mb-3 hover:text-amber-300 ${
                pathname === link.path &&
                "text-black font-bold font-sans contrast-125"
              }`}
              prefetch={false}
            >
              <Image
                src={link.icon}
                width={25}
                height={25}
                alt="user"
                className=""
              />
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <>
      <nav className="flex fixed top-0 left-0 right-0 bg-gray-100 md:bg-lime-500 text-white glassmorphism md:glassmorphism-lime justify-between items-center h-20 z-[9999] shadow-sm">
        {/* LOGO Section */}
        <section className="flex justify-between items-center pl-3 md:pl-0 h-full">
          <div className="w-28 md:w-64 bg-transparent md:bg-white flex justify-center items-center rounded-tr-3xl h-full">
            <Link href={isUserLogin ? "/user/home" : "/"}>
              <Image
                src="/assets/images/et-logo-2.svg"
                alt="logo"
                width={160}
                height={150}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="sm:hidden w-28 bg-transparent h-full flex justify-center items-center">
            <Link href={isUserLogin ? "/user/home" : "/"}>
              <Image
                src="/assets/images/telebirr-logo-color.svg"
                alt="logo"
                width={160}
                height={150}
                className="object-contain"
              />
            </Link>
          </div>
        </section>

        {/* Desktop Navigation */}
        <div className="sm:flex hidden w-full justify-between items-center">
          <section className="flex mx-auto gap-x-5">
            {/* Link Section */}
            <ul className="flex justify-center items-center gap-8">
              {navLink.map((link) => (
                <li key={link.title}>
                  <a
                    href={
                      link.isProtectedRoute && !isUserLogin
                        ? "/guest/login"
                        : link.path
                    }
                    target={link.isPathNew && "_blank"}
                    className={`font-bold mb-9 hover:text-amber-300 hover:-translate-y-1 transition ease-in-out delay-150 duration-300 ${
                      pathname === link.path &&
                      "text-amber-400 font-sans contrast-125"
                    }`}
                    prefetch={false}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>

            {/* Profile Section */}
            <div
              className={`flex ${
                !isUserLogin
                  ? "flex-0 gap-3 md:gap-5"
                  : "gap-4 items-center justify-between"
              } pl-10`}
            >
              {!isUserLogin ? (
                <Link href="/guest/login">
                  {/* <Button
                    type="default"
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "5px",
                      color: "#000000",
                      fontWeight: "bold",
                      width: "150px",
                      height: "35px",
                      lineHeight: "40px",
                      fontFamily: " 'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Login
                  </Button> */}
                  <Button
                    type="default"
                    style={{
                      border: "2px solid white",
                      background: "transparent",
                      color: "white",
                      fontWeight: "bold",
                      width: "150px",
                      height: "35px",
                      lineHeight: "35px",
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Login
                    <ArrowRightOutlined style={{ color: "white" }} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    visible={settingsDropdownVisible}
                    onVisibleChange={(visible) =>
                      setSettingsDropdownVisible(visible)
                    }
                  >
                    <UserOutlined style={{ fontSize: "20px", color: "#fff" }} />
                  </Dropdown>

                  <Dropdown
                    overlay={notificationMenu}
                    trigger={["click"]}
                    visible={notificationDropdownVisible}
                    onVisibleChange={(visible) =>
                      setNotificationDropdownVisible(visible)
                    }
                  >
                    <BellOutlined style={{ fontSize: "20px", color: "#fff" }} />
                  </Dropdown>

                  <div className="w-56">
                    <Button
                      onClick={handleSignOut}
                      type="default"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        fontWeight: "normal",
                        width: "120px",
                        height: "36px",
                        lineHeight: "40px",
                        fontFamily:
                          " 'Roboto', 'Helvetica', 'Arial', sans-serif",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="bg-white rounded-tl-3xl flex justify-center items-center h-full w-60 self-end">
            <Link href={isUserLogin ? "/user/home" : "/"}>
              <Image
                src="/assets/images/telebirr-logo-color.svg"
                alt="logo"
                width={160}
                height={160}
                className="object-contain"
              />
            </Link>
          </section>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex relative">
          <div className="flex">
            <Image
              src="/assets/icons/menu.png"
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
              // onClick={() => setMobileDropdown(!mobileDropdown)}
              onClick={handleModalOpen}
            />
          </div>
        </div>
      </nav>
      <ProfileSidenav
        show={viewModal}
        closeModal={handleModalClose}
        isUserLogin={isUserLogin}
        user={user}
        handleSignOut={handleSignOut}
      >
        {ProfileSideNav}
      </ProfileSidenav>
    </>
  );
};

export default Nav;
