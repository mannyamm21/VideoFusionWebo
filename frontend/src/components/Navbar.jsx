import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import styled1 from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Upload from "./Upload";
import { logout } from "../Context/userSlice";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import apiClient from "../apiClient";
import { toast } from "react-hot-toast";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import PostAddIcon from "@mui/icons-material/PostAdd";
import UploadTiwtte from "./uploadTiwtte";
import Logoo from "../img/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "./Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const Container = styled1.div`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.bg};
  height: 56px;
  z-index: 1000;
`;

const Wrapper = styled1.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0px 20px;
  position: relative;
  color: ${({ theme }) => theme.text};
`;

const Search = styled1.div`
  width: 40%;
  display: flex;

  align-items: center;
  justify-content: space-between;
  margin-left: 20px; /* Adjusted margin to position the search closer */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled1.input`
  border: none;
  width: 100%;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
`;

const User = styled1.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Avatar = styled1.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

const LoginButton = styled1.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: rgba(167, 139, 250, 1);
  padding: 0.590rem 0.8rem;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  outline: 0;
  transition: all 0.2s ease;
  text-decoration: none;
`;

const Icon = styled1.svg`
  height: 1.5rem;
  width: 1.5rem;
`;

const Texts = styled1.span`
  margin-left: 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
`;

const Text2 = styled1.span`
  font-weight: 600;
`;

const UploadSelect = styled1.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.textSoft};
  border-radius: 4px;
  padding: 10px;
  z-index: 1001;
  display: ${({ open }) => (open ? "block" : "none")};
`;

const Option = styled1.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.bgHover};
  }
`;

const Logo = styled1.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Reduced gap to move closer */
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 22px;
  color: ${({ theme }) => theme.text};
`;

const Img = styled1.img`
  height: 40px;
`;

const MenuButton = styled1.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export default function Navbar({ darkMode, setDarkMode }) {
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [q, setQ] = useState("");
  const [uploadSelectOpen, setUploadSelectOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // New state for menu
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (q.trim()) {
      navigate(`/search?q=${q}`);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await apiClient.post("/auth/sign-out");
      dispatch(logout());
      localStorage.removeItem("accessToken");
      toast.success("LogOut Successful");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Error during logout");
    }
  };

  const handleUploadSelect = (type) => {
    setUploadType(type);
    setUploadSelectOpen(false);
    setOpen(true);
  };

  return (
    <>
      <Container>
        <Wrapper>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <MenuIcon />
          </MenuButton>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo>
              <Img src={Logoo} />
              VideoFusion
            </Logo>
          </Link>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <SearchOutlinedIcon onClick={handleSearch} />
          </Search>
          <div>
            {darkMode ? (
              <LightModeIcon
                onClick={() => setDarkMode(!darkMode)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <DarkModeIcon
                onClick={() => setDarkMode(!darkMode)}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
          {currentUser?.data?.user ? (
            <User>
              <VideoCallOutlinedIcon
                onClick={() => setUploadSelectOpen(!uploadSelectOpen)}
                style={{ cursor: "pointer" }}
              />
              {uploadSelectOpen && (
                <UploadSelect open={uploadSelectOpen}>
                  <Option onClick={() => handleUploadSelect("video")}>
                    <SlideshowIcon /> Upload Video
                  </Option>
                  <Option onClick={() => handleUploadSelect("tiwtte")}>
                    <PostAddIcon /> Tiwtte
                  </Option>
                </UploadSelect>
              )}
              <NotificationsNoneIcon />
              <Link
                to={
                  currentUser?.data?.user?._id
                    ? `/profile/${currentUser.data.user?._id}`
                    : "#"
                }
              >
                <Avatar
                  src={currentUser?.data?.user?.avatar || "/default-avatar.png"}
                />
              </Link>
              <LoginButton as="button" onClick={handleSignOut}>
                <Icon>
                  <LogoutIcon />
                </Icon>
                <Texts>
                  <Text2>Sign Out</Text2>
                </Texts>
              </LoginButton>
            </User>
          ) : (
            <Link to="sign-in" style={{ textDecoration: "none" }}>
              <LoginButton>
                <Icon>
                  <LoginIcon />
                </Icon>
                <Texts>
                  <Text2>SIGN IN</Text2>
                </Texts>
              </LoginButton>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && uploadType === "tiwtte" && <UploadTiwtte setOpen={setOpen} />}
      {open && uploadType === "video" && <Upload setOpen={setOpen} />}
      <Menu open={menuOpen} setOpen={setMenuOpen} />
    </>
  );
}
