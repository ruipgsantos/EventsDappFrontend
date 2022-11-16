import { Button, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";
import { Routes, Route, Link } from "react-router-dom";
import Events from "./views/Events";
import Space from "./views/Space";
import EditUser from "./views/EditUser";
import MetamaskButton from "./components/MetamaskButton";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {
  return (
    <div className="App">
      <Nav className="header">
        <h1 className="title">
          <Link to="/events">Events</Link>
        </h1>
        {/* <Nav.Item>
          <Link to="/events">events</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/space/1">space</Link>
        </Nav.Item> */}
        <Nav.Item>
          <Link to="/edituser">Edit Profile</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/myspace">Edit Space</Link>
        </Nav.Item>
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
    </div>
  );
}

export default App;
