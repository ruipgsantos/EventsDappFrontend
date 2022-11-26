import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useCookie = ({ key, checkEvery = 3000 }) => {
  const [cookieState, setCookieState] = useState(Cookies.get(key));

  useEffect(() => {
    setInterval(() => {
      setCookieState(Cookies.get(key));
    }, checkEvery);
  }, [checkEvery, key]);

  return [cookieState, setCookieState];
};

export default useCookie;
