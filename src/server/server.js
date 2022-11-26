import axios from "axios";
axios.defaults.withCredentials = true;

let eventList = [];
let spaceList = [];

const request = {
  getEvents: async () => {
    if (eventList.length > 0) {
      return eventList;
    }
    const response = await axios.get("http://localhost:5000/events/");

    eventList = response.data;

    if (!!eventList) {
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

  getEventsBySpace: async (spaceId) => {
    const spaceIdNum = Number(spaceId);
    if (eventList.length > 0) {
      const res = eventList.filter((event) => {
        return event.spaceId === spaceIdNum;
      });

      return res;
    }
    const response = await axios.get(`http://localhost:5000/events/${spaceId}`);
    return response.data;
  },

  //TODO: implement server get
  getSpace: async (spaceId) => {
    const spaceIdNum = Number(spaceId);
    const space = spaceList.find((space) => {
      return space.id === spaceIdNum;
    });

    return space;
  },
};

const auth = {
  requestNonce: async (pubkey) => {
    return (await axios.get(`http://localhost:5000/auth/nonce/${pubkey}`)).data
      .nonce;
  },

  sendSignedMessage: async ({ signedmsg, pubkey }) => {
    const res = await axios.post(`http://localhost:5000/auth/login`, {
      signedmsg,
      pubkey,
    });

    if (res.status === 200) {
      return true;
    } else {
      throw Error({ status: 400 });
    }
  },
};

export { request, auth };
