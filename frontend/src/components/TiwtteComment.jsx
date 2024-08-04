import PropTypes from "prop-types"; // Import PropTypes
import { useEffect, useState } from "react";
import styled from "styled-components";
import apiClient from "../apiClient";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const DeleteButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const Text = styled.span`
  font-size: 14px;
`;

const TiwtteComment = ({ comment, onDelete }) => {
  const [channel, setChannel] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/users/find/${comment?.userId}`);
        setChannel(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [comment.userId]);

  const handleDeleteComment = async () => {
    try {
      await apiClient.delete(`/comment/tiwtte/${comment?._id}`);
      onDelete(comment._id);
    } catch (error) {
      console.log("Error deleting comment:", error);
    }
  };

  return (
    <Container>
      <Link to={`/profile/${channel?._id}`}>
        <Avatar src={channel?.avatar} />
      </Link>
      <Details>
        <Link to={`/profile/${channel?._id}`}>
          <Name>{channel?.username}</Name>
        </Link>
        <DateText>{format(comment?.createdAt)}</DateText>
        <Text>{comment?.desc}</Text>
      </Details>
      {currentUser?.data?.user?._id === channel?._id && (
        <DeleteButton onClick={handleDeleteComment}>
          <DeleteOutlineIcon style={{ width: "20px", height: "20px" }} />
        </DeleteButton>
      )}
    </Container>
  );
};

// PropTypes validation
TiwtteComment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TiwtteComment;
