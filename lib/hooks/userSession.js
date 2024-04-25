"use client";
import { useState, useEffect } from "react";
import { getUserData } from "@app/api-services/authService";

const userSession = () => {
  const [session, setSession] = useState({});

  useEffect(() => {
    let r = async function () {
      const user = await getUserData(); //{email: 'ebsa16teklu@gmail.com', iat: 1685207877, exp: 1685213877}
      if (user !== null) return setSession({ user });
      return setSession(null);
    };
    r();
  }, []);

  return session;
};

export default userSession;
