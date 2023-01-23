import Space from "./Space";

export default interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  date: Date;
  spaceId: number;
  space: Space;
}
