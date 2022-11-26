import { useState, useEffect } from "react";
import EventList from "../components/EventList";
import { useParams } from "react-router-dom";
import { request } from "../server/server";

export default function Space() {
  let { id } = useParams();
  const [space, setSpace] = useState(null);

  useEffect(() => {
    const getSpace = async () => {
      const currentSpace = await request.getSpace(id);
      setSpace(currentSpace);
    };

    getSpace();
  }, [id]);

  return space === null ? (
    <div className="loading"></div>
  ) : (
    <div>
      <h2>{space.name}</h2>
      <EventList spaceContext={true} spaceId={id} />
    </div>
  );
}
