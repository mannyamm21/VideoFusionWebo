import styled from "styled-components";
import Card from "../components/Card";
import { useEffect, useState } from "react";
// import axios from "axios";
import apiClient from "../apiClient";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function Home({ type = "random" }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("Fetching videos of type:", type);
    const fetchVideos = async () => {
      try {
        const res = await apiClient.get(`/videos/${type}`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error); // Log the error
      }
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {Array.isArray(videos) &&
        videos.map((video) => <Card key={video._id} video={video} />)}
    </Container>
  );
}
