import { request } from "../server/server";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/eventlist.css";
import * as moment from "moment";

export default function EventList({ eventList, spaceContext, spaceId }) {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const getData = async () => {
      let events;
      try {
        if (spaceId) {
          events = await request.getEventsBySpace(spaceId);
        } else {
          events = await request.getEvents();
        }

        setEvents(events);
      } catch (e) {
        setEvents([]);
        throw e;
      }
    };

    getData();
  }, [spaceId]);

  const getCardStyle = (event) => {
    const eventDate = moment(event.date);
    const today = moment();

    if (eventDate.isBefore(today)) {
      return "secondary";
    } else if (eventDate.isSame(today, "day")) {
      return "success";
    }

    return "primary";
  };

  return (
    <div className="container">
      {events === null ? (
        events && events.length > 0 ? (
          <div className="loading"></div>
        ) : (
          <div>There are no events available</div>
        )
      ) : (
        events &&
        events.map((event) => {
          return (
            <Card
              bg={getCardStyle(event)}
              key={`${event.name}${event.description}`}
            >
              <div className="eventImage">
                <img src="/images/metamaskfox.png" alt="" />
              </div>
              <Card.Header as="h3">{event.name}</Card.Header>
              <Card.Body>
                <Card.Subtitle>
                  {moment(event.date).format("LLL")}
                </Card.Subtitle>
                <Card.Subtitle>
                  {event.location || event.space.location}
                </Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
              </Card.Body>
              {!spaceContext && (
                <Card.Footer>
                  <Link to={`/space/${event.space.id}`}>
                    {`${event.space.name}>>>`}
                  </Link>
                </Card.Footer>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
