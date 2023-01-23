import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Events from "./views/EventsView";
import Space from "./views/SpaceView";
import EditUser2 from "./views/EditUserView";
import MetamaskButton from "./components/MetamaskButton";
import { useCallback } from "react";
import useDappSession from "./hooks/DappSession";

function App() {
  const navigate = useNavigate();
  const onLogout = useCallback((): void => {
    navigate("/");
  }, [navigate]);

  const [
    { userAddress, isWeb3Available, isLoading, isLoggedIn },
    { login, logout },
  ] = useDappSession({ initUserAddress: "", onLogout });

  return (
    <div className="App">
      <Nav className="header">
        <h1 className="title">
          <Link to="/events">Events</Link>
        </h1>
        {isLoggedIn && (
          <Nav.Item>
            <Link to={`/edituser/${userAddress}`}>Edit Profile</Link>
          </Nav.Item>
        )}
        {isLoggedIn && (
          <Nav.Item>
            <Link to="/myspace">Edit Space</Link>
          </Nav.Item>
        )}
        {isLoggedIn && <div className="userAddress">{userAddress}</div>}
        <Nav.Item>
          <MetamaskButton
            isWeb3Available={isWeb3Available!}
            isLoading={isLoading!}
            isLoggedIn={isLoggedIn!}
            login={login!}
            logout={logout!}
          />
        </Nav.Item>
      </Nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Events />}></Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/space/:id" element={<Space />}></Route>
          <Route path="/edituser/:address" element={<EditUser2 />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
