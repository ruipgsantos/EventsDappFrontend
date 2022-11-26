import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { auth } from "../server/server";
import Cookies from "js-cookie";
import useCookie from "./Cookie";

/**
 * Hook designed to handle entire session of a dapp
 *
 * @param initUserAddress
 * Initial user public key address
 * @param  onLogout
 * Optional method to execute when logout is triggered
 * @returns
 */
const useDappSession = ({ initUserAddress, onLogout }) => {
  const [userAddress, setUserAddress] = useState(initUserAddress);
  const [isWeb3Available, setWeb3Available] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [web3Object, setWeb3Obj] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useCookie({
    key: "isAuthenticated",
  });

  /**
   * Method to handle logout. If existing, it will also execute the provided {@link onLogout} method
   */
  const doLogout = useCallback(() => {
    setUserAddress(undefined);
    setIsLoggedIn(false);

    if (onLogout) {
      onLogout();
    }

    //TODO: request server to delete session
  }, [onLogout]);

  useEffect(() => {
    setIsLoggedIn(!!isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (window.ethereum) {
      setWeb3Available(true);
      setWeb3Obj(new Web3(window.ethereum));

      window.ethereum.on("accountsChanged", (addArr) => {
        if (!addArr[0]) {
          //user disconnected
          doLogout();
        } else {
          //user simply changed account
          setUserAddress(addArr[0]);
        }
      });
    }
  }, [doLogout]);

  /**
   * Requests connection for user's Metamask wallet
   *
   * @returns
   */
  const doWeb3Login = async () => {
    if (isWeb3Available) {
      const addArr = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setUserAddress(addArr[0]);

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
  const doServerLogin = async (userAddr) => {
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

    let signedMessage = await window.ethereum.request({
      method: "eth_signTypedData",
      params: [params, userAddr],
      from: userAddr,
    });

    //send back to server and await response
    await auth.sendSignedMessage({
      signedmsg: signedMessage,
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
      await doServerLogin(userAddr);

      setIsAuthenticated(Cookies.get("isAuthenticated"));
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
    { userAddress, isWeb3Available, web3Object, isLoading, isLoggedIn },
    { login, logout },
  ];
};

export default useDappSession;
