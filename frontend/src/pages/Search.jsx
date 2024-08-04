import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import ChannelCard from "../components/ChannelCard";
import VideoCard from "../components/VideoCard";
import apiClient from "../apiClient";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Adds space between sections */
`;

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export default function Search() {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const query = useLocation().search;

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await apiClient.get(`/videos/search${query}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [query]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await apiClient.get(`/users/search${query}`);
      setUsers(res.data);
    };
    fetchUsers();
  }, [query]);

  return (
    <Container>
      {/* Video Section */}

      {/* Channel Section */}
      <Section>
        {users.map((user) => (
          <ChannelCard
            key={user._id}
            channelId={user._id}
            avatar={user.avatar}
            channelName={user.name}
            username={user.username}
            videoCount={user.videos.length}
            subscriber={user.subscribers}
          />
        ))}
      </Section>

      {/* Video Cards for each user's videos */}
      <Section>
        {users.map((user) =>
          user.videos.map((video) => <VideoCard key={video} videoId={video} />)
        )}
      </Section>
    </Container>
  );
}
