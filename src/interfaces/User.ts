import Space from "./Space";

export default interface User {
  id: number;
  name: string;
  address: string;
  space: Space;
}
