import React, { useState, useEffect } from "react";
import EventList from "../components/EventList";
import { useParams } from "react-router-dom";
import { request } from "../server/server";
import { Space } from "../interfaces";

export default function SpaceView() {
  let { id } = useParams();
  const [space, setSpace] = useState<Space>();

  useEffect(() => {
    const getSpace = async (): Promise<void> => {
      const currentSpace = await request.getSpace(Number(id));
      setSpace(currentSpace);
    };

    getSpace();

  }, [id]);

  return space === null ? (
    <div className="loading"></div>
  ) : (
    <div>
      <h2>{space?.name}</h2>
      <EventList spaceContext={true} spaceId={Number(id)} eventList={[]} />
    </div>
  );
}
