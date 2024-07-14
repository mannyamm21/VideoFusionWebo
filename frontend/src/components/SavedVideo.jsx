import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function SavedVideo() {
  const [savedVideos, setSavedVideos] = useState([]);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const response = await axios.get(`/users/${userId}/savedVideos`);
        setSavedVideos(response.data);
      } catch (error) {
        console.error("Error fetching saved videos:", error);
        setError("Failed to load saved videos."); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchSavedVideos();
  }, [userId]);

  if (loading) return <div>Loading...</div>; // Loading message
  if (error) return <div>{error}</div>; // Error message

  return (
    <Container>
      {savedVideos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
}