import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Web3 from "web3";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import "../styles/metamaskbutton.css";

export default function MetamaskButton() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [userAccount, setUserAccount] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeb3Available, setWeb3Available] = useState(true);
  const [redirect, doRedirect] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (addArr) => {
        Cookies.set("userAccount", addArr[0]);
        setUserAccount(addArr[0]);

        //make user go to initial page when account is reset
        doRedirect(true);
      });

      const userAcc = Cookies.get("userAccount");
      setUserAccount(userAcc);
    } else {
      setWeb3Available(false);
    }
  }, []);

  useEffect(() => {
    doRedirect(false);
  }, [redirect]);

  const initWeb3 = async () => {
    // setWeb3Available(false);
    // return;
    let web3PObj;
    let web3Obj;
    // Modern dapp browsers...
    if (window.ethereum) {
      web3PObj = window.ethereum;
      try {
        // Request account access
        setIsLoading(true);
        window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((addArr) => {
            Cookies.set("userAccount", addArr[0]);
            setUserAccount(addArr[0]);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }

      web3Obj = new Web3(web3PObj);

      setWeb3Provider(web3PObj);
      setWeb3(web3Obj);
      setWeb3Available(true);
    } else {
      setWeb3Available(false);
    }
  };

  const getButtonClass = useCallback(() => {
    if (userAccount && userAccount !== "undefined") {
      return "success";
    } else if (!isWeb3Available) {
      return "danger";
    }
    return "primary";
  }, [isWeb3Available, userAccount]);

  const getButtonMessage = useCallback(() => {
    if (userAccount && userAccount !== "undefined") {
      return "Connected";
    } else if (!isWeb3Available) {
      return "Please install Metamask to connect";
    }
    return "Connect with Metamask";
  }, [isWeb3Available, userAccount]);

  return (
    <Button
      onClick={() => {
        isWeb3Available && initWeb3();
      }}
      className={`metamask_button`}
      variant={getButtonClass()}
      disabled={(userAccount && userAccount !== "undefined") || isLoading}
    >
      {getButtonMessage()}

      {!isLoading ? (
        <div className="metamask_fox" />
      ) : (
        <div className="metmask_loading" />
      )}

      {redirect && <Navigate to="/" />}
    </Button>
  );
}
