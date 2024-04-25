"use client";
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSearchParams } from 'next/navigation'
// import { useQuery } from "next/navigation";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { message } from "antd";
import Link from "next/link";
import axios from "axios";

const PasswordResetPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter();
  const pathname = usePathname();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState(null);

  // useEffect(() => {
  //   const queryToken = router?.query?.token;
  //   console.log({router:router.query})
  //   if (queryToken) {
  //     setToken(queryToken);
  //   }
  // }, [router.query]);

  useEffect(() => {
   
    // Extracting query parameters from the pathname
    const pathname = searchParams.get('token')
    console.log({pathname})
    const queryStartIndex = pathname.indexOf("?");
    if (queryStartIndex !== -1) {
      const queryString = pathname.substring(queryStartIndex + 1);
      const queryParams = new URLSearchParams(queryString);
      const queryToken = queryParams.get("token");

      console.log({queryToken})
      
      if (queryToken) {
        setToken(queryToken);
      }
    }
  }, [pathname]);

  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        message.error("Passwords don't match");
        return;
      }

      if (!newPassword || newPassword.trim() === "") {
        message.error("New Password is required");
        return;
      }

      if (newPassword !== confirmPassword) {
        message.error("Passwords don't match");
        return;
      }

     

      console.log({
        token__s:token
      })

      const response = await axios.post(
        "https://developer.ethiotelecom.et/v2/user/reset-password",
        {
          token,
          newPassword,
        }
      );

      if (response.status === 200) {
        message.success(
          "Password reset successfully. You can now login with your new password."
        );
        setNewPassword("");
        setConfirmPassword("");

        router.push("/guest/login");
      }
    } catch (error) {
      // Show error message
      message.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="w-[40%] mx-auto mt-28 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-semibold  mb-4">Reset your password</h1>
      <div>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-lime-500"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span>
        </div>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-lime-500"
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showPassword)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          </span>
        </div>

        <button
          onClick={handleResetPassword}
          className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Reset Password
        </button>
      </div>
      {/* Return To Sign In and Sign Up for Free options */}

      <div className="mt-4 flex flex-col gap-y-2 justify-center items-center">
        <Link href="/guest/login" className="text-green font-semibold">
          Return To Sign In
        </Link>
        <p>
          <small> Don't Have An Account?</small>
          <Link href="/guest/signUp" className="text-green font-semibold">
            {" "}
            Sign Up for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

// export async function getServerSideProps({ query }) {
//   const tokenQueryParam = new URLSearchParams(query.token);
//   const token = tokenQueryParam.get("token");

//   return {
//     props: {
//       token: token || null,
//     },
//   };
// }

// PasswordResetPage.getInitialProps = async ({ query }) => {
//   const tokenQueryParam = new URLSearchParams(query.token);
//   const token = tokenQueryParam.get("token");

//   console.log({
//     query,
//     token: token
//   });

//   return { token };
// };

// PasswordResetPage.getInitialProps = async ({ query }) => {
 
//   const { token } = query;
//    console.log({
//     query,
//     token_:token
//   })
//   return { token };
// };

export default PasswordResetPage;
