import { sampleEvents } from "../test/sampledata";
import EventList from "../components/EventList";

export default function Events() {
  return (
    <div>
      <EventList eventList={sampleEvents} />
    </div>
  );
}
