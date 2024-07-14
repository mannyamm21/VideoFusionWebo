import styled from "styled-components";
import Card from "./Card";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";

const Container = styled.div`
  flex: 2;
`;

export default function Recommendation({ tags }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await apiClient.get(`/videos/tag?tags=${tags}`);
        setVideos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
}
