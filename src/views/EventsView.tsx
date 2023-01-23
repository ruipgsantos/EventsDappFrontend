import EventList from "../components/EventList";
import React from "react";

export default function Events() {
  return (
    <div>
      <EventList eventList={[]} spaceId={0} spaceContext={false} />
    </div>
  );
}
