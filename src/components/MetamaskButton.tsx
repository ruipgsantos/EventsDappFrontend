import React, { useCallback } from "react";
import { Icon } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function MetamaskButton({
  isWeb3Available,
  login,
  logout,
  isLoading,
  isLoggedIn,
}: {
  isWeb3Available: boolean,
  login: Function,
  logout: Function,
  isLoading: boolean,
  isLoggedIn: boolean,
}) {
  const pngIcon = (
    <Icon>
      <img
        style={{ width: 20, height: 20, marginBottom: 20 }}
        alt="metamask"
        src="/images/metamaskfox.png"
      />
    </Icon>
  );

  const getColor = useCallback((): "success" | "error" | "secondary" => {
    let color = "secondary";
    if (isLoggedIn) {
      return "success";
    } else if (!isWeb3Available) {
      return "error";
    }

    return color as "success" | "error" | "secondary";
  }, [isLoggedIn, isWeb3Available]);

  const getButtonMessage = useCallback(() => {
    if (isLoggedIn) {
      return "Logout";
    } else if (!isWeb3Available) {
      return "Please install Metamask to connect";
    }
    return "Connect with Metamask";
  }, [isLoggedIn, isWeb3Available]);

  const handleClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
  };

  return (
    <LoadingButton
      onClick={handleClick}
      // {...getButtonProps()}
      color={getColor()}
      variant="contained"
      disabled={isLoading}
      endIcon={pngIcon}
      loading={isLoading}
    >
      {getButtonMessage()}
    </LoadingButton>
  );
}
