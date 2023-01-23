import { request } from "../server/server";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/eventlist.css";
import moment from "moment";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Event } from "../interfaces"
import React from "react";

export default function EventList({ eventList, spaceContext, spaceId }:
  { eventList: Event[], spaceContext: boolean, spaceId: number }) {
  const [events, setEvents] = useState<Event[]>(eventList);

  useEffect(() => {
    const getData = async () => {
      let events: Event[];
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

  const isPastClass = (event: Event) => {
    const eventDate = moment(event.date);
    const today = moment();

    if (eventDate.isBefore(today)) {
      return "past";
    }
    return "";
  };

  const getLoading = () => {
    return <div className="loading"></div>;
  };

  const getEmpty = () => {
    return <div>There are no events.</div>;
  };

  const getExisting = () => {
    return events.map((event) => {
      return (
        <Card
          className={`${isPastClass(event)}`}
          variant="outlined"
          key={`${event.name}${event.description}`}
          sx={{
            height: 350,
            width: 350,
            position: "relative",
            flexShrink: 0,
            flexGrow: 0,
            margin: 1,
          }}
        >
          <CardMedia
            sx={{ height: 140 }}
            image="/images/metamaskfox.png"
          // title="green iguana"
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {event.name}
            </Typography>
            <Typography variant="subtitle2" component="div">
              {moment(event.date).format("LLL")}
            </Typography>
            <Typography gutterBottom variant="subtitle2" component="div">
              {event.location || event.space.location}
            </Typography>
            <Typography
              sx={{ height: 40, overflow: "hidden", textOverflow: "ellipsis" }}
              variant="body2"
              color="text.secondary"
            >
              {event.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">
              <Link to={`/space/${event.space.id}`}>See More</Link>
            </Button>
          </CardActions>
        </Card>
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}
      className="container"
    >
      {events === null
        ? getLoading()
        : events.length > 0
          ? getExisting()
          : getEmpty()}
    </Box>
  );
}
