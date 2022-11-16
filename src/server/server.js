import axios from "axios";

let eventList = [];
let spaceList = [];

const request = {
  getEvents: async () => {
    if (eventList.length > 0) {
      return eventList;
    }
    console.log("getEvents");
    const response = await axios.get("http://localhost:5000/events/");
    console.log(response);

    eventList = response.data;

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
    console.log(`getEventsBySpace with id ${spaceId}`);
    const response = await axios.get(`http://localhost:5000/events/${spaceId}`);
    console.log(response);
    return response.data;
  },

  getSpace: async (spaceId) => {
    const spaceIdNum = Number(spaceId);
    const space = spaceList.find((space) => {
      return space.id === spaceIdNum;
    });

    return space;
  },
};

export { request };
