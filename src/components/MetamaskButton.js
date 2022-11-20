import { useCallback } from "react";
import { Button } from "react-bootstrap";
import "../styles/metamaskbutton.css";

export default function MetamaskButton({
  isWeb3Available,
  login,
  logout,
  isLoading,
  isLoggedIn,
}) {
  const getButtonClass = useCallback(() => {
    if (isLoggedIn) {
      return "success";
    } else if (!isWeb3Available) {
      return "danger";
    }
    return "primary";
  }, [isLoggedIn, isWeb3Available]);

  const getButtonMessage = useCallback(() => {
    if (isLoggedIn) {
      return "Connected";
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
    <Button
      onClick={handleClick}
      className={`metamask_button`}
      variant={getButtonClass()}
      disabled={isLoggedIn || isLoading}
    >
      {getButtonMessage()}

      {!isLoading ? (
        <div className="metamask_fox" />
      ) : (
        <div className="metmask_loading" />
      )}
    </Button>
  );
}
