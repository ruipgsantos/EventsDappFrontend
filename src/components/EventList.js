import { Card } from "react-bootstrap";
import "../styles/eventlist.css";

export default function EventList({ eventList, spaceContext = true }) {
  return (
    <div className="container">
      {eventList.map((event) => {
        return (
          <Card>
            <div className="eventImage">
              <img src="/images/metamaskfox.png" alt="" />
            </div>
            <Card.Header>{event.name}</Card.Header>
            <Card.Body>
              <Card.Subtitle>{event.date}</Card.Subtitle>
              <Card.Subtitle>{event.location}</Card.Subtitle>
              <Card.Text>{event.description}</Card.Text>
            </Card.Body>
            {spaceContext && <Card.Footer>{event.space}</Card.Footer>}
          </Card>
        );
      })}
    </div>
  );
}
