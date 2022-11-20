import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Events from "./views/Events";
import Space from "./views/Space";
import EditUser from "./views/EditUser";
import MetamaskButton from "./components/MetamaskButton";
import { useCallback } from "react";
import Cookies from "js-cookie";
import useDappSession from "./hooks/DappSession";

function App() {
  const navigate = useNavigate();
  const onLogout = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const [
    { userAddress, isWeb3Available, web3Object, isLoading, isLoggedIn },
    { login, logout },
  ] = useDappSession({ onLogout });

  // useEffect(() => {
  //   if (!isWeb3Available) return;
  //   console.log(`user address changed: ${userAddress}`);

  //   const signMessage = async () => {
  //     try {
  //       const signedMessage = await window.ethereum.request({
  //         method: "personal_sign",
  //         params: [userAddress, "nonce"],
  //       });

  //       console.log(signedMessage);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  //   if (userAddress) {
  //     signMessage();
  //   }
  // }, [isWeb3Available, userAddress, web3Obj]);
  return (
    <div className="App">
      <Nav className="header">
        <h1 className="title">
          <Link to="/events">Events</Link>
        </h1>
        {userAddress && (
          <Nav.Item>
            <Link to="/edituser">Edit Profile</Link>
          </Nav.Item>
        )}
        {userAddress && (
          <Nav.Item>
            <Link to="/myspace">Edit Space</Link>
          </Nav.Item>
        )}
        <div className="userAddress">{userAddress}</div>
        <Nav.Item>
          <MetamaskButton
            isWeb3Available={isWeb3Available}
            isLoading={isLoading}
            isLoggedIn={isLoggedIn}
            login={login}
            logout={logout}
          />
        </Nav.Item>
      </Nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Events />}></Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/space/:id" element={<Space />}></Route>
          <Route path="/edituser" element={<EditUser />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
