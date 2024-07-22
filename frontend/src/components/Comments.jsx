import styled from "styled-components";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-hot-toast";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const SendButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await apiClient.get(`/comment/${videoId}`);
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await apiClient.post(
        `/comment/`,
        { videoId, desc: newComment },
        { headers: { Authorization: `Bearer ${currentUser.data.accessToken}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.log("You are not Logged In");
      toast.error("You are not Logged In");
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  return (
    <Container>
      <NewComment>
        {currentUser && <Avatar src={currentUser?.data?.user?.avatar} />}
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
        />
        <SendButton onClick={handleAddComment}>
          <SendIcon />
        </SendButton>
      </NewComment>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onDelete={handleDeleteComment}
        />
      ))}
    </Container>
  );
}
