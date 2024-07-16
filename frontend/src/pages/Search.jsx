import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import ChannelCard from "../components/ChannelCard";
import VideoCard from "../components/VideoCard";
import apiClient from "../apiClient";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
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
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}

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
      <div>{"      "}</div>
      <Hr />
      {users.map((user) =>
        user.videos.map((video) => <VideoCard key={video} videoId={video} />)
      )}
    </Container>
  );
}
