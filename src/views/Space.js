import { sampleEvents } from "../test/sampledata";
import EventList from "../components/EventList";

export default function Space() {
  return (
    <div>
      <h2>Space 1 Name</h2>
      <EventList eventList={sampleEvents} />
    </div>
  );
}
