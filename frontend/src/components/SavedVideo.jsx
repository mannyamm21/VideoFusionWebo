import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import Card from "./Card";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function SavedVideo() {
  const [savedVideos, setSavedVideos] = useState([]);
  const { userId } = useParams();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchSavedVideos = async () => {
      try {
        const response = await apiClient.get(
          `/users/${currentUser?.data?.user?._id}/savedVideos`
        );
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
      {savedVideos.length ? (
        savedVideos.map((video) => <Card key={video._id} video={video} />)
      ) : (
        <div style={{ color: `${({ theme }) => theme.text}` }}>
          No Saved Videos
        </div>
      )}
    </Container>
  );
}
