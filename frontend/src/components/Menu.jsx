import styled from "styled-components";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

const MenuContainer = styled.div`
  position: fixed;
  top: 56px;
  left: 0;
  width: 200px;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;

const Title = styled.h2`
  font-size: 12px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
`;

export default function Menu({ open, setOpen }) {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <MenuContainer open={open}>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Item>
            <HomeIcon />
            Home
          </Item>
        </Link>
        <Link to="/all" style={{ textDecoration: "none" }}>
          <Item>
            <DynamicFeedIcon />
            Tiwttes
          </Item>
        </Link>
        <Link to="trend" style={{ textDecoration: "none" }}>
          <Item>
            <ExploreOutlinedIcon />
            Explore
          </Item>
        </Link>
        <Link to="sub" style={{ textDecoration: "none" }}>
          <Item>
            <SubscriptionsOutlinedIcon />
            Subscriptions
          </Item>
        </Link>
        <Hr />
        <Item>
          <VideoLibraryOutlinedIcon />
          Library
        </Item>
        {currentUser && (
          <>
            <Link
              to={`/savedVideos/${currentUser?.data?.user?._id}`}
              style={{ textDecoration: "none" }}
            >
              <Item>
                <BookmarkAddedIcon />
                Saved Videos
              </Item>
            </Link>
          </>
        )}
        {!currentUser && (
          <>
            <Hr />
            <Link to="sign-in" style={{ textDecoration: "none" }}>
              <Login>
                Sign in to like videos, comment, and subscribe.
                <Button variant="outlined">
                  <AccountCircleOutlinedIcon />
                  SIGN IN
                </Button>
              </Login>
            </Link>
          </>
        )}
        <Hr />
        <Title>BEST OF YOURTUBE</Title>
        <Link to="/category/music" style={{ textDecoration: "none" }}>
          <Item>
            <LibraryMusicOutlinedIcon />
            Music
          </Item>
        </Link>
        <Link to="/category/sports" style={{ textDecoration: "none" }}>
          <Item>
            <SportsBasketballOutlinedIcon />
            Sports
          </Item>
        </Link>
        <Link to="/category/gaming" style={{ textDecoration: "none" }}>
          <Item>
            <SportsEsportsOutlinedIcon />
            Gaming
          </Item>
        </Link>
        <Link to="/category/movies" style={{ textDecoration: "none" }}>
          <Item>
            <MovieOutlinedIcon />
            Movies
          </Item>
        </Link>
        <Link to="/category/news" style={{ textDecoration: "none" }}>
          <Item>
            <ArticleOutlinedIcon />
            News
          </Item>
        </Link>
        <Link to="/category/live" style={{ textDecoration: "none" }}>
          <Item>
            <LiveTvOutlinedIcon />
            Live
          </Item>
        </Link>
        <Hr />
        {currentUser && (
          <Link
            to={`/settings/${currentUser?.data?.user?._id}`}
            style={{ textDecoration: "none" }}
          >
            <Item>
              <SettingsOutlinedIcon />
              Settings
            </Item>
          </Link>
        )}
        <Item>
          <FlagOutlinedIcon />
          Report
        </Item>
        <Item>
          <HelpOutlineOutlinedIcon />
          Help
        </Item>
        {/* <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item> */}
      </Wrapper>
    </MenuContainer>
  );
}
