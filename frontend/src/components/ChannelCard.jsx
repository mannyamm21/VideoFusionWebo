import apiClient from "../apiClient";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { subscription } from "../Context/userSlice";
import { toast } from "react-hot-toast";
const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  padding-left: 20%;
`;

const Channelcard = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  width: 800px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-direction: column;

  @media (min-width: 400px) {
    flex-direction: row;
  }
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 16px;

  @media (min-width: 600px) {
    margin-bottom: 0;
    margin-right: 16px;
  }
`;

const Info = styled.div`
  flex-grow: 1;
  text-align: center;

  @media (min-width: 600px) {
    text-align: left;
  }
`;

const Name = styled.div`
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;

const Username = styled.div`
  color: #666;
  margin: 4px 0;
`;

const VideoCount = styled.div`
  color: #999;
`;

const Subscribe = styled.button`
  background-color: ${({ subscribed }) => (subscribed ? "#ccc" : "#cc0000")};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 16px;

  @media (min-width: 600px) {
    margin-top: 0;
    margin-left: 16px;
  }

  &:hover {
    background-color: ${({ subscribed }) => (subscribed ? "#bbb" : "#ff0000")};
  }
`;

const ChannelCard = ({
  avatar,
  channelName,
  username,
  videoCount,
  subscriber,
  channelId,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Check if the user is subscribed
  const subscribed =
    currentUser?.data?.user?.subscribedUsers?.includes(channelId);

  const handleSub = async () => {
    try {
      if (subscribed) {
        await apiClient.put(`/users/unsub/${channelId}`);
      } else {
        await apiClient.put(`/users/sub/${channelId}`);
      }
      dispatch(subscription(channelId)); // Update Redux state
    } catch (error) {
      console.error("Error during subscription action:", error);
      toast.error("You are not Logged In");
    }
  };

  return (
    <Container>
      <Channelcard>
        <Avatar src={avatar} alt={`${channelName} avatar`} />
        <Info>
          <Link to={`/profile/${channelId}`}>
            <Name>{channelName}</Name>
          </Link>
          <Username>@{username}</Username>
          <VideoCount>{videoCount} Videos</VideoCount>
          <VideoCount>{subscriber} Subscribers</VideoCount>
        </Info>
        <Subscribe onClick={handleSub} subscribed={subscribed}>
          {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
        </Subscribe>
      </Channelcard>
    </Container>
  );
};

export default ChannelCard;
