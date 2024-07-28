import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import EditIcon from "@mui/icons-material/Edit";
import EditProfile from "../components/EditProfile";
import { styled as muiStyled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { red, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { subscription } from "../Context/userSlice";
import apiClient from "../apiClient";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 50px; // Adjust based on the height of your navbar
  }
`;

const Header = styled.div`
  position: relative;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const CoverImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
`;

const AvatarContainer = styled.div`
  position: absolute;
  top: calc(100% + 80px);
  left: 20px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  margin-left: 70px;
  display: flex;
  flex-direction: column;
`;

const Username = styled.p`
  font-size: 15px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.textSoft};
`;

const Name = styled.h2`
  font-size: 24px;
  margin-bottom: 1px;
  color: ${({ theme }) => theme.text};
`;

const SubscribersCount = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const SectionTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
  margin-top: 180px;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const ColorButton = muiStyled(Button)(({ theme, $subscribed }) => ({
  color: theme.palette.getContrastText($subscribed ? grey[500] : red[900]),
  backgroundColor: $subscribed ? grey[500] : red[800],
  "&:hover": {
    backgroundColor: $subscribed ? grey[600] : red[700],
  },
  marginTop: "10px",
  position: "absolute",
  top: "300px",
  right: "20px",
}));

// Add media query separately
const ResponsiveColorButton = muiStyled(ColorButton)(({ theme }) => ({
  "@media (max-width: 768px)": {
    top: "250px",
    right: "10px",
  },
}));

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await apiClient.get(`/users/find/${userId}`);
        const userData = userRes.data;
        setUser(userData);
        setChannel(userData);
        const videoIds = userData.videos;
        const videoPromises = videoIds.map((id) =>
          apiClient.get(`/videos/find/${id}`)
        );
        const videoResults = await Promise.all(videoPromises);
        const videosData = videoResults.map((res) => res.data);
        setVideos(videosData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleSub = async () => {
    if (!channel._id) {
      console.error("Channel ID is undefined");
      return;
    }

    try {
      currentUser.data.user.subscribedUsers.includes(channel._id)
        ? await apiClient.put(`/users/unsub/${channel._id}`)
        : await apiClient.put(`/users/sub/${channel._id}`);
      dispatch(subscription(channel._id));
    } catch (error) {
      console.error("Error in handleSub:", error);
    }
  };

  return (
    <>
      <Container>
        <Header>
          <CoverImage
            src={
              user.coverImage ||
              "https://fortatelier.com/wp-content/uploads/2021/06/YouTube-Banner-Image-Size-Template.png"
            }
            alt="Cover Image"
          />
          <Hr />
          <AvatarContainer>
            <Avatar src={user.avatar} alt="Avatar" />
            <UserInfo>
              <Name>{user.name}</Name>
              <Username>@{user.username}</Username>
              <SubscribersCount>
                {user.subscribers} subscribers • {user.videos.length} Videos
              </SubscribersCount>
            </UserInfo>
          </AvatarContainer>
          {currentUser?.data?.user?._id === userId && (
            <EditIcon
              style={{ position: "absolute", top: "260px", right: "20px" }}
              onClick={() => setOpen(true)}
            />
          )}
          <ResponsiveColorButton
            variant="contained"
            onClick={handleSub}
            $subscribed={currentUser?.data?.user?.subscribedUsers?.includes(
              channel?._id
            )}
          >
            {currentUser?.data?.user?.subscribedUsers?.includes(channel?._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </ResponsiveColorButton>
        </Header>

        <SectionTitle>Uploaded Videos</SectionTitle>
        <VideoContainer>
          {Array.isArray(videos) &&
            videos.map((video) => <Card key={video?._id} video={video} />)}
        </VideoContainer>

        {open && <EditProfile setOpen={setOpen} />}
      </Container>
    </>
  );
};

export default Profile;
