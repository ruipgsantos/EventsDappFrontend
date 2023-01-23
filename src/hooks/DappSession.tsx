import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { auth } from "../server/server";
import useCookie from "./Cookie";


import { MetaMaskInpageProvider } from "@metamask/providers";


declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}


/**
 * Hook designed to handle entire session of a dapp
 *
 * @param initUserAddress
 * Initial user public key address
 * @param  onLogout
 * Optional method to execute when logout is triggered
 * @returns
 */
const useDappSession = ({ initUserAddress, onLogout }:
  { initUserAddress: string, onLogout: Function }) => {
  const [isWeb3Available, setWeb3Available] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [web3Object, setWeb3Obj] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [cookieAuthState, isAuthenticated, setIsAuthenticated] = useCookie<any>({
    key: "authd",
  });
  const [cookieAddrState, cookieUserAddress, setCookieUserAddress] = useCookie<string>({ key: "useraddr" });
  const [userAddress, setUserAddress] = useState<string>(cookieUserAddress);

  /**
   * Method to handle logout. If existing, it will also execute the provided {@link onLogout} method
   */
  const doLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCookieUserAddress("");

    onLogout && onLogout();

    //TODO: request server to delete session
  }, [onLogout, setCookieUserAddress, setIsAuthenticated]);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated() === 'true');
  }, [isAuthenticated]);

  useEffect(() => {
    if (window.ethereum) {
      setWeb3Available(true);
      setWeb3Obj(new Web3(window.ethereum as any));

      window.ethereum.on("accountsChanged", (...addArr: unknown[]) => {
        if (!addArr[0]) {
          //user disconnected
          doLogout();
        } else {
          //user simply changed account
          setCookieUserAddress(addArr[0] as string);
        }
      });
    }
  }, [doLogout, setCookieUserAddress]);

  /**
   * Requests connection for user's Metamask wallet
   *
   * @returns
   */
  const doWeb3Login = async () => {
    if (isWeb3Available && window.ethereum) {
      const addArr = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];

      setCookieUserAddress(addArr[0]);

      return addArr[0];
    }
  };

  /**
   * Given a user wallet address, executes the challenge-response flow to authenticate with server
   *  - request nonce from server with public key
   *  - sign nonce with private key
   *  - request login with signed message and public key
   *
   * @param {*} userAddr
   */
  const doServerLogin = async (userAddr: string) => {
    //request nonce from server
    const nonce = await auth.requestNonce(userAddr);

    //request sign from metamask user
    const params = [
      {
        type: "string",
        name: "nonce",
        value: nonce,
      },
    ];

    let signedMessage = await window?.ethereum?.request<string>({
      method: "eth_signTypedData",
      params: [params, userAddr],
    });

    //send back to server and await response
    await auth.sendSignedMessage({
      signedmsg: signedMessage!,
      pubkey: userAddr,
    });
  };

  /**
   * Login flow. It will connect user Metamask wallet and request authentication from server
   */
  const login = async () => {
    try {
      setIsLoading(true);

      //web3
      const userAddr = await doWeb3Login();

      //server
      await doServerLogin(userAddr!);

      // Cookies.set("authd", "true", { expires: 1 });
      setIsAuthenticated(true);
      setCookieUserAddress(userAddr!)
      setIsLoggedIn(true);
    } catch (err) {
      console.error(`Could not login`);
      console.error(err);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = doLogout;

  return [
    { userAddress: cookieAddrState, isWeb3Available, web3Object, isLoading, isLoggedIn },
    { login, logout },
  ];
};

export default useDappSession;
