import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";

const useDappSession = ({ initUserAddress, onLogout }) => {
  const [userAddress, setUserAddress] = useState(initUserAddress);
  const [isWeb3Available, setWeb3Available] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [web3Object, setWeb3Obj] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const doLogout = useCallback(() => {
    setUserAddress(undefined);
    setIsLoggedIn(false);

    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);

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

  const startWeb3Login = async () => {
    if (isWeb3Available) {
      try {
        const addArr = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(addArr[0]);
        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoading(false);
        console.error(`User denied account access: ${err}`);
      }
    }
  };

  const login = () => {
    startWeb3Login();
  };

  const logout = doLogout;

  return [
    { userAddress, isWeb3Available, web3Object, isLoading, isLoggedIn },
    { login, logout },
  ];
};

export default useDappSession;
