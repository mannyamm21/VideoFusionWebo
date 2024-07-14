// Video.jsx
import React, { useState, useEffect } from "react";
import styled1 from "styled-components";
import Recommendation from "../components/Recommendation";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
import { fetchSuccess, like, dislike } from "../Context/VideoSlice";
import { subscription, addSavedVideo } from "../Context/userSlice";
import { styled } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import ShareModal from "../components/ShareModal";

const Container = styled1.div`
  display: flex;
  gap: 24px;
  padding: 20px;
  overflow-y: auto;
`;

const Content = styled1.div`
  flex: 5;
`;

const VideoWrapper = styled1.div``;

const Title = styled1.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled1.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled1.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled1.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const ButtonStyled = styled1.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled1.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled1.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled1.div`
  display: flex;
  gap: 20px;
`;

const Image = styled1.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled1.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled1.span`
  font-weight: 500;
`;

const ChannelCounter = styled1.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled1.p`
  font-size: 14px;
`;

const VideoFrame = styled1.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const ColorButton = styled(Button)(({ theme, subscribed }) => ({
  color: theme.palette.getContrastText(subscribed ? grey[500] : red[900]),
  backgroundColor: subscribed ? grey[500] : red[800],
  "&:hover": {
    backgroundColor: subscribed ? grey[600] : red[700],
  },
  border: "none",
  borderRadius: "3px",
  height: "max-content",
  padding: "10px 20px",
  cursor: "pointer",
}));

export default function Video() {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const location = useLocation();
  const [open, setOpen] = useState(false); // State for the modal
  const path = location.pathname.split("/")[2];

  const [channel, setChannel] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`);
        const channelRes = await axios.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        setIsSaved(currentUser?.savedVideos?.includes(videoRes.data._id)); // Check saved status here
        await axios.put(`/videos/view/${videoRes.data._id}`); // Add view count here
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [path, dispatch, currentUser]);

  const handleLike = async () => {
    await axios.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };

  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    if (currentUser.subscribedUsers.includes(channel._id)) {
      await axios.put(`/users/unsub/${channel._id}`);
    } else {
      await axios.put(`/users/sub/${channel._id}`);
    }
    dispatch(subscription(channel._id));
  };

  const handleSaveVideo = async () => {
    if (!currentUser || !currentVideo) return;

    const isCurrentlySaved = currentUser?.savedVideos?.includes(
      currentVideo?._id
    );

    if (!isCurrentlySaved) {
      try {
        await axios.put(`/users/savedVideos/${currentVideo?._id}`);
        // Update the saved videos list directly
        dispatch(
          addSavedVideo([...currentUser.savedVideos, currentVideo?._id])
        );
        setIsSaved(true);
      } catch (err) {
        console.error("Error saving video:", err);
      }
    } else {
      console.log("Video already saved");
    }
  };

  return (
    <Container>
      {currentVideo ? (
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo?.videoUrl} controls />
          </VideoWrapper>
          <Title>{currentVideo?.title}</Title>
          <Details>
            <Info>
              {currentVideo.views} views • {format(currentVideo?.createdAt)}
            </Info>
            <Buttons>
              <ButtonStyled onClick={handleLike}>
                {currentVideo?.likes?.includes(currentUser?._id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )}
                {currentVideo?.likes?.length}
              </ButtonStyled>
              <ButtonStyled onClick={handleDislike}>
                {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOffAltOutlinedIcon />
                )}{" "}
              </ButtonStyled>
              <ButtonStyled onClick={() => setOpen(true)}>
                <ReplyOutlinedIcon /> Share
              </ButtonStyled>
              <ButtonStyled onClick={handleSaveVideo}>
                <AddTaskOutlinedIcon />
                {isSaved ? "Saved" : "Save"}
              </ButtonStyled>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image src={channel?.avatar} />
              <ChannelDetail>
                <Link to={`/profile/${channel?._id}`}>
                  <ChannelName>{channel?.name}</ChannelName>
                </Link>
                <ChannelCounter>
                  {channel?.subscribers} subscribers
                </ChannelCounter>
                <Description>{currentVideo?.desc}</Description>
              </ChannelDetail>
            </ChannelInfo>
            <ColorButton
              variant="contained"
              onClick={handleSub}
              subscribed={currentUser?.subscribedUsers?.includes(channel._id)}
            >
              {currentUser?.subscribedUsers?.includes(channel._id)
                ? "SUBSCRIBED"
                : "SUBSCRIBE"}
            </ColorButton>
          </Channel>
          <Hr />
          <Comments videoId={currentVideo._id} />
        </Content>
      ) : (
        <div>Loading...</div>
      )}
      <Recommendation tags={currentVideo?.tags} />
      <ShareModal isOpen={open} onRequestClose={() => setOpen(false)} />
    </Container>
  );
}
