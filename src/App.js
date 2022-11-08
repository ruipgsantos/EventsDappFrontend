import { Button, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/app.css";
import { Routes, Route, Link } from "react-router-dom";
import Events from "./views/Events";
import Space from "./views/Space";

function App() {
  return (
    <div className="App">
      <Nav className="header">
        <h1 className="title">Events</h1>
        <Nav.Item>
          <Link to="/events">events</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/space">space</Link>
        </Nav.Item>
        <Nav.Item>
          <Button className="metamask_button" variant="primary">
            Connect with Metamask
            <div className="metamask_fox" />
          </Button>
        </Nav.Item>
      </Nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<Events />}></Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/space" element={<Space />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
