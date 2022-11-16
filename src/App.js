import { Button, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Events from "./views/Events";
import Space from "./views/Space";
import EditUser from "./views/EditUser";
import MetamaskButton from "./components/MetamaskButton";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

function App() {
  const userAddress = useSelector((state) => state.session.userAddress);
  const token = useSelector((state) => state.session.token);

  useEffect(() => {}, [userAddress]);
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
          <MetamaskButton />
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

      {/* {!userAddress && <Navigate to="/"></Navigate>} */}
    </div>
  );
}

export default App;
