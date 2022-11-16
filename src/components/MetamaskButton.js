import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Web3 from "web3";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import "../styles/metamaskbutton.css";
import { useSelector, useDispatch } from "react-redux";
import { setUserAddress, disconnectUser } from "../features/sessionSlice";

export default function MetamaskButton() {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [web3, setWeb3] = useState(null);
  // const [userAccount, setUserAccount] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeb3Available, setWeb3Available] = useState(true);
  const [redirect, doRedirect] = useState(false);

  const dispatch = useDispatch();
  const userAddress = useSelector((state) => state.session.userAddress);
  const token = useSelector((state) => state.session.token);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (addArr) => {
        //user disconnected
        if (!addArr[0]) {
          dispatch(disconnectUser());
        }

        Cookies.set("userAddress", addArr[0]);

        //make user go to initial page when account is reset
        doRedirect(true);
      });
    } else {
      setWeb3Available(false);
    }

    //on startup set state with current session address
    const userAddr = Cookies.get("userAddress");
    dispatch(setUserAddress(userAddr));
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
            dispatch(setUserAddress(addArr[0]));
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            dispatch(disconnectUser());
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
    if (userAddress && userAddress !== "undefined") {
      return "success";
    } else if (!isWeb3Available) {
      return "danger";
    }
    return "primary";
  }, [isWeb3Available, userAddress]);

  const getButtonMessage = useCallback(() => {
    if (userAddress && userAddress !== "undefined") {
      return "Connected";
    } else if (!isWeb3Available) {
      return "Please install Metamask to connect";
    }
    return "Connect with Metamask";
  }, [isWeb3Available, userAddress]);

  return (
    <Button
      onClick={() => {
        isWeb3Available && initWeb3();
      }}
      className={`metamask_button`}
      variant={getButtonClass()}
      disabled={(userAddress && userAddress !== "undefined") || isLoading}
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
