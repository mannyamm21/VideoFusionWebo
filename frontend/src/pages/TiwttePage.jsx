import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiClient from "../apiClient";
import { CircularProgress, Menu, MenuItem } from "@mui/material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { like, dislike, fetchSuccess, fetchFailure } from "../Context/Tiwtte";
import { format } from "timeago.js";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import TiwtteComments from "../components/TiwtteComments";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTiwtte from "../components/EditTiwtte";

const PageContainer = styled.div`
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg};
  padding: 20px;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.soft};
  max-width: 800px; /* Adjust this value to make the post larger or smaller */
  margin: 0 auto;
  margin-bottom: 50px;
`;

const Image = styled.img`
  width: auto;
  height: auto;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const Date = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 10px;
  margin-right: 500px;
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const LikesDislikes = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textSoft};
`;

const IconButton = styled.div`
  display: flex;
  padding: 0 10px 0 10px;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer; /* Add cursor pointer to indicate clickable */
`;

const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.textSoft};
`;

const ChannelAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ChannelName = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

export default function TiwttePage() {
  const [tiwtte, setTiwtte] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState({});
  const dispatch = useDispatch();
  const [open1, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { tiwttes } = useSelector((state) => state.tiwtte);

  // Menu state management
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await apiClient.get(`/tiwttes/find/${id}`);
        setTiwtte(res.data);
        if (res.data.userId) {
          const channelRes = await apiClient.get(
            `/users/find/${res.data.userId}`
          );
          setChannel(channelRes.data);
          dispatch(fetchSuccess(res.data));
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        dispatch(fetchFailure());
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, dispatch]);

  if (!tiwtte) return null;

  const handleLike = async () => {
    try {
      await apiClient.put(`/users/liketiwtte/${tiwtte._id}`);
      dispatch(like(currentUser?.data?.user?._id));
    } catch (error) {
      console.log(error);
      toast.error("You are not Logged In", error);
    }
  };

  const handleDislike = async () => {
    try {
      await apiClient.put(`/users/disliketiwtte/${tiwtte._id}`);
      dispatch(dislike(currentUser?.data?.user?._id));
    } catch (error) {
      console.log(error);
      toast.error("You are not Logged In");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/tiwttes/${tiwtte._id}`);
      toast.success("Tiwtte has been deleted");
      navigate("/all");
    } catch (error) {
      console.log(error);
      toast.error("Tiwtte has not been deleted");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    );
  }

  if (!tiwtte) {
    return <PageContainer>Tiwtte not found</PageContainer>;
  }

  return (
    <PageContainer>
      <ContentContainer>
        <ChannelInfo>
          {channel.avatar && (
            <ChannelAvatar src={channel.avatar} alt="Channel Avatar" />
          )}
          <Link to={`/profile/${channel?._id}`}>
            <ChannelName>{channel.name}</ChannelName>
          </Link>
          <Date>• {format(tiwtte?.createdAt)}</Date>
          {currentUser.data.user._id === tiwttes.userId ? (
            <>
              <MoreVertIcon onClick={handleMenuClick} />
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                <MenuItem onClick={() => setOpen(true)}>Edit</MenuItem>
              </Menu>
            </>
          ) : (
            <div></div>
          )}
        </ChannelInfo>
        <Description>{tiwtte?.desc}</Description>
        {tiwtte?.postImage && (
          <Image src={tiwtte?.postImage} alt="Tiwtte Post Image" />
        )}
        <Actions>
          <LikesDislikes>
            <IconButton onClick={handleLike}>
              {tiwttes?.likes?.includes(currentUser?.data?.user?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}
            </IconButton>
            {tiwttes?.likes?.length}
            <IconButton onClick={handleDislike}>
              {tiwttes?.dislikes?.includes(currentUser?.data?.user?._id) ? (
                <ThumbDownAltIcon />
              ) : (
                <ThumbDownOffAltIcon />
              )}
            </IconButton>
            <QuestionAnswerIcon />
            <span>{tiwttes?.comments?.length || 0}</span>
          </LikesDislikes>
          <ReplyOutlinedIcon />
        </Actions>
      </ContentContainer>
      <TiwtteComments tiwtteId={tiwttes?._id} />
      {open1 && <EditTiwtte tiwtteId={tiwttes?._id} setOpen={setOpen} />}
    </PageContainer>
  );
}
