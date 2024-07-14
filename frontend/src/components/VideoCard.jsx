import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import apiClient from "../apiClient";
const Container = styled.div`
  width: ${(props) => (props.type !== "sm" ? "360px" : "100%")};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "25px")};
  cursor: pointer;
  display: ${(props) => (props.type === "sm" ? "flex" : "block")};
  gap: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  border-radius: 10px;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => (props.type !== "sm" ? "16px" : "0")};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => (props.type === "sm" ? "none" : "block")};
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const VideoCard = ({ type, videoId }) => {
  const [channel, setChannel] = useState({});
  const [video, setVideo] = useState({});

  useEffect(() => {
    const fetchVideoAndChannel = async () => {
      try {
        // Fetch the video first
        const videoRes = await apiClient.get(`/videos/find/${videoId}`);
        setVideo(videoRes.data);

        // Then fetch the channel based on the video userId
        if (videoRes.data.userId) {
          const channelRes = await apiClient.get(
            `/users/find/${videoRes.data.userId}`
          );
          setChannel(channelRes.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideoAndChannel();
  }, [videoId]); // Depend on videoId to refetch if it changes

  if (!video) {
    return null;
  }

  return (
    <Link to={`/video/${video?._id}`} style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image type={type} src={video?.imgUrl} />
        <Details type={type}>
          <ChannelImage type={type} src={channel?.avatar} />
          <Texts>
            <Title>{video?.title}</Title>
            <ChannelName>{channel?.name}</ChannelName>
            <Info>
              {video?.views} views • {format(video?.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default VideoCard;
