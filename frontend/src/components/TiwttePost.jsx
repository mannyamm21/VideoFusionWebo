import { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import apiClient from "../apiClient";
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const Container = styled.div`
  width: 80%;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: ${({ theme }) => theme.bgLighter};
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 350px; /* Adjust this value as needed */
  border-radius: 10px;
  margin-bottom: 10px;
  object-fit: contain; /* or use 'cover' based on your preference */
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const Date = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 10px;
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.textSoft};
`;

const IconButton = styled.div`
  display: flex;
  padding: 0 10px 0 10px;
  color: ${({ theme }) => theme.textSoft};
`;

const LikesDislikes = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textSoft};
`;

const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ChannelAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ChannelName = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const TiwttePost = ({ post }) => {
  const [tiwtte, setTiwtte] = useState({});
  const [channel, setChannel] = useState({});
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchPost = async () => {
      if (post && post._id) {
        try {
          const res = await apiClient.get(`/tiwttes/find/${post._id}`);
          setTiwtte(res.data);
          if (res.data.userId) {
            const channelRes = await apiClient.get(
              `/users/find/${res.data.userId}`
            );
            setChannel(channelRes.data);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      }
    };
    fetchPost();
  }, [post, dispatch]);

  if (!tiwtte) return null;

  const handleLike = async () => {
    try {
      await apiClient.put(`/users/liketiwtte/${tiwtte._id}`);
    } catch (error) {
      console.log(error);
      toast.error("You are not Logged In");
    }
  };

  const handleDislike = async () => {
    try {
      await apiClient.put(`/users/disliketiwtte/${tiwtte._id}`);
    } catch (error) {
      console.log(error);
      toast.error("You are not Logged In");
    }
  };

  return (
    <Container>
      <ChannelInfo>
        {channel.avatar && (
          <ChannelAvatar src={channel.avatar} alt="Channel Avatar" />
        )}
        <Link to={`/profile/${channel?._id}`}>
          <ChannelName>{channel.name}</ChannelName>
        </Link>
        <Date>• {format(tiwtte?.createdAt)}</Date>
      </ChannelInfo>
      <Link to={`/tiwtte/${tiwtte?._id}`} style={{ textDecoration: "none" }}>
        <Description>{tiwtte?.desc}</Description>
        {tiwtte?.postImage && (
          <Image src={tiwtte?.postImage} alt="Tiwtte Post Image" />
        )}
      </Link>
      <Actions>
        <LikesDislikes>
          <IconButton onClick={handleLike}>
            {tiwtte?.likes?.includes(currentUser?.data?.user?._id) ? (
              <ThumbUpIcon />
            ) : (
              <ThumbUpOutlinedIcon />
            )}
          </IconButton>
          <span>{tiwtte?.likes?.length}</span>
          <IconButton onClick={handleDislike}>
            {tiwtte?.dislikes?.includes(currentUser?.data?.user?._id) ? (
              <ThumbDownIcon />
            ) : (
              <ThumbDownOffAltOutlinedIcon />
            )}
          </IconButton>
          <Link
            to={`/tiwtte/${tiwtte?._id}`}
            style={{ textDecoration: "none" }}
          >
            <QuestionAnswerIcon />
            <span> {tiwtte?.comments?.length || 0}</span>
          </Link>
        </LikesDislikes>
      </Actions>
    </Container>
  );
};

export default TiwttePost;
