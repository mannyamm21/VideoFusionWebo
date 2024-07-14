import styled from "styled-components";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function Categories() {
  const [videos, setVideos] = useState([]);
  const { category } = useParams();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await apiClient.get(`/videos/category/${category}`);
        setVideos(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVideos();
  }, [category]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
}
