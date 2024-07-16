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

const Container = styled1.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bg};
  height: 56px;
`;

const Wrapper = styled1.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled1.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export default function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(currentUser);

  const handleSignOut = async () => {
    try {
      console.log("Signing out..."); // Debug log
      const response = await apiClient.post("/auth/sign-out");
      console.log("Sign-out response:", response); // Debug log
      dispatch(logout());
      toast.success("LogOut Successful");
      navigate("/sign-in"); // Redirect to sign-in page or homepage after logout
    } catch (error) {
      console.error("Failed to sign out", error);
      toast.error("Error during logout:", error);
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
              onKeyPress={(e) => e.key === "Enter"}
            />
            <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)} />
          </Search>
          {currentUser?.data?.user?._id !== null ? (
            <User>
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
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
      {open && <Upload setOpen={setOpen} />}
    </>
  );
}
