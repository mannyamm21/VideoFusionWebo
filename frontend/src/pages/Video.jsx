// Video.jsx
import { useState, useEffect } from "react";
import styled1, { css } from "styled-components";
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
import { format } from "timeago.js";
import { fetchSuccess, like, dislike } from "../Context/VideoSlice";
import { subscription, addSavedVideo } from "../Context/userSlice";
import { styled } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import ShareModal from "../components/ShareModal";
import apiClient from "../apiClient";
import { toast, Toaster } from "react-hot-toast";

const Container = styled1.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  overflow-y: auto;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Content = styled1.div`
  flex: 5;
`;

const VideoWrapper = styled1.div`
  width: 100%;
`;

const Title = styled1.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled1.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Info = styled1.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled1.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
  margin-top: 10px;

  @media (min-width: 768px) {
    margin-top: 0;
  }
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
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
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
  const path = location.pathname.split("/")[2];
  const [open, setOpen] = useState(false); // State for the modal
  const [channel, setChannel] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await apiClient.get(`/videos/find/${path}`);
        const channelRes = await apiClient.get(
          `/users/find/${videoRes.data.userId}`
        );
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        setIsSaved(
          currentUser?.data?.user?.savedVideos?.includes(videoRes.data._id)
        );
        setIsSubscribed(
          currentUser?.data?.user?.subscribedUsers?.includes(
            channelRes.data._id
          )
        );
        await apiClient.put(`/videos/view/${videoRes.data._id}`);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [path, dispatch, currentUser]);

  const handleLike = async () => {
    await apiClient.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser?.data?.user?._id));
  };

  const handleDislike = async () => {
    await apiClient.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser?.data?.user?._id));
  };

  const handleSub = async () => {
    const action = isSubscribed ? "unsub" : "sub";
    await apiClient.put(`/users/${action}/${channel._id}`);
    dispatch(subscription(channel._id));
    setIsSubscribed(!isSubscribed);
  };

  const handleSaveVideo = async () => {
    if (!currentUser || !currentVideo) return;

    const isCurrentlySaved = currentUser?.data?.user?.savedVideos?.includes(
      currentVideo._id
    );

    if (!isCurrentlySaved) {
      try {
        await apiClient.put(`/users/savedVideos/${currentVideo?._id}`);
        dispatch(
          addSavedVideo([
            ...currentUser.data.user.savedVideos,
            currentVideo?._id,
          ])
        );
        setIsSaved(true);
        toast.success("Video saved successfully!");
      } catch (err) {
        console.error("Error saving video:", err);
        toast.error("Failed to save video.");
      }
    } else {
      console.log("Video already saved");
    }
  };

  return (
    <Container>
      <Toaster />
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
                {currentVideo?.likes?.includes(currentUser?.data?.user?._id) ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )}
                {currentVideo?.likes?.length}
              </ButtonStyled>
              <ButtonStyled onClick={handleDislike}>
                {currentVideo?.dislikes?.includes(
                  currentUser?.data?.user?._id
                ) ? (
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
              subscribed={isSubscribed}
            >
              {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
            </ColorButton>
          </Channel>
          <Hr />
          <Comments videoId={currentVideo?._id} />
        </Content>
      ) : (
        <div>Loading...</div>
      )}
      <Recommendation tags={currentVideo?.tags} />
      <ShareModal isOpen={open} onRequestClose={() => setOpen(false)} />
    </Container>
  );
}
