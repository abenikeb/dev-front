import Backdrop from "../Backdrop/Backdrop";
import "./ProfileSidenav.css";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";

const ProfileSidenav = (props) => {
  let attachedClasses = ["ProfileSidenav-Modal", "ProfileSidenav-Modal-Close"];
  if (props.show) {
    attachedClasses = ["ProfileSidenav-Modal", "ProfileSidenav-Modal-Open"];
  }

  return (
    <div>
      <Backdrop show={props.show} clicked={props.closeModal} />
      <div className={attachedClasses.join(" ")}>
        <div className="ProfileSidenav-modal-header">
          <div className="bg-lime-500 w-full h-full p-5 flex flex-col items-center justify-center">
            {props.isUserLogin && (
              <Image
                src="/assets/icons/profile.svg"
                width={80}
                height={80}
                alt="users"
              />
            )}

            {props.isUserLogin ? (
              <div className="flex text-white my-2">
                {props.user?.firstName}
              </div>
            ) : (
              <Link
                onClick={props.closeModal}
                href="/guest/login"
                className="self-start flex gap-x-2 pt-7"
              >
                <Image
                  src="/assets/icons/mobile-user-header.svg"
                  width={70}
                  height={70}
                  alt="users"
                />
                <Button btn_class="btn-outline" label="Login" />
              </Link>
            )}
          </div>
          <span onClick={props.closeModal}>x</span>
        </div>
        <div className="ProfileSidenav-modal-body">{props.children}</div>

        <div>
          {props.isUserLogin && (
            <>
              <hr />
              <ul className="flex flex-col justify-start items-start text-black pl-8 pt-5">
                <li>
                  <Link
                    href="/user/profile"
                    className={`font-semibold flex gap-x-5 mb-4 hover:text-amber-300`}
                    onClick={props.closeModal}
                  >
                    <Image
                      src="/assets/icons/profile-login.svg"
                      width={25}
                      height={25}
                      alt="user"
                      className=""
                    />
                    Profile
                  </Link>
                </li>

                <li>
                  <Link
                    href="/user/profile"
                    className={`font-semibold flex gap-x-5 mb-3 hover:text-amber-300`}
                    onClick={props.closeModal}
                  >
                    <Image
                      src="/assets/icons/change-password.svg"
                      width={25}
                      height={25}
                      alt="user"
                      className=""
                    />
                    Change Password
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>

        <div className="flex justify-center">
          {!props.isUserLogin ? (
            <></>
          ) : (
            <button
              type="button"
              onClick={props.handleSignOut}
              className="mt-5 w-3/4 black_btn"
            >
              <Image
                src="/assets/icons/mobile-logout.svg"
                width={25}
                height={25}
                alt="user"
                className="mr-2"
                onClick={props.closeModal}
              />
              Sign Out
            </button>
          )}
        </div>

        <div className="ProfileSidenav-modal-footer"></div>
      </div>
    </div>
  );
};

export default ProfileSidenav;
