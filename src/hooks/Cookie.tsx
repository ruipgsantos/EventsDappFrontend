import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function useCookie<T>({ key, checkEvery, initValue }: { key?: string, checkEvery?: number, initValue?: T }
): [T, () => T, (val: T) => void] {
  const [cookieState, setCookieState] = useState<T>(initValue!);

  const setVal = useCallback((val: T) => {
    Cookies.set(key!, val as string, { expires: 1 });
    setCookieState(val);
  }, [key]);

  const getVal = useCallback((): T => {
    return cookieState;
  }, [cookieState]);

  useEffect(() => {
    setInterval(() => {
      setCookieState(Cookies.get(key ?? "") as T);
    }, checkEvery);

    const currCookie = Cookies.get(key ?? "") as T;
    if (currCookie) {
      setCookieState(currCookie);
    }
  }, []);

  return [cookieState, getVal, setVal];
};