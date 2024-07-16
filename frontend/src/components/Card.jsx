// Card.jsx
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

  @media (max-width: 768px) {
    width: 100%; // Full width on small screens
    flex-direction: column; // Stack elements vertically
  }
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

  @media (max-width: 768px) {
    flex-direction: column; // Stack details on small screens
    margin-top: 10px; // Adjust top margin
  }
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => (props.type === "sm" ? "none" : "block")};

  @media (max-width: 768px) {
    display: block; // Show channel image on small screens
  }
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

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      if (video && video.userId) {
        try {
          const res = await apiClient.get(`/users/find/${video.userId}`);
          setChannel(res.data);
        } catch (error) {
          console.error("Error fetching channel:", error); // Log the error
        }
      }
    };
    fetchChannel();
  }, [video]);

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

export default Card;
