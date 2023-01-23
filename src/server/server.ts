import axios from "axios";
import { Event, Space, User } from "../interfaces";
axios.defaults.withCredentials = true;

let eventList: Event[] = [];
let spaceList: Space[] = [];

const api_url = process.env.REACT_APP_API_URL;

const request = {
  getEvents: async (): Promise<Event[]> => {
    if (eventList.length > 0) {
      return eventList;
    }
    const response = await axios.get(`${api_url}/events/`);

    eventList = response.data;

    if (!eventList) {
      return [];
    }

    //set space list
    eventList.forEach((event) => {
      if (
        !spaceList.some((space) => {
          return space.id === event.spaceId;
        })
      ) {
        spaceList.push(event.space);
      }
    });
    return eventList;
  },

  getEventsBySpace: async (spaceId: number): Promise<Event[]> => {
    const spaceIdNum = Number(spaceId);
    if (eventList.length > 0) {
      const res = eventList.filter((event) => {
        return event.spaceId === spaceIdNum;
      });

      return res;
    }
    const response = await axios.get(`${api_url}/events/${spaceId}`);
    return response.data;
  },

  //TODO: implement server get
  getSpace: (spaceId: number | string): Space => {
    const spaceIdNum = Number(spaceId);
    const space = spaceList.find((space) => {
      return space.id === spaceIdNum;
    });

    return space!;
  },

  getUser: async (pubkey: string) => {
    const res = await axios.get<User>(`${api_url}/user/${pubkey}`);
    return res.data;
  },

  updateUser: async (user: User) => {
    return (await axios.put<User>(`${api_url}/user`, user)).status;
  },
};

const auth = {
  requestNonce: async (pubkey: string) => {
    return (await axios.get(`${api_url}/auth/nonce/${pubkey}`)).data.nonce;
  },

  sendSignedMessage: async ({
    signedmsg,
    pubkey,
  }: {
    signedmsg: string;
    pubkey: string;
  }) => {
    const res = await axios.post(`${api_url}/auth/login`, {
      signedmsg,
      pubkey,
    });

    if (res.status === 200) {
      return true;
    } else {
      throw Error(`400`);
    }
  },
};

export { request, auth };
