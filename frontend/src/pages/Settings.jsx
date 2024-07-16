import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { logout } from "../Context/userSlice";
import { toast } from "react-hot-toast"; // Add this line if you're using toast notifications
import { useState } from "react"; // Add useState for form handling

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Avatar = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2cb5a0;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #249f8f;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DeleteButton = styled.button`
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #cc0000;
  background-color: #ff3131;
  overflow: hidden;
  border-radius: 10px;
  transition: all 0.3s;

  .button__text {
    transform: translateX(35px);
    color: #fff;
    font-weight: 600;
    transition: all 0.3s;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.soft};
  padding-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Section = styled.div`
  margin-bottom: 30px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Username = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Name = styled.h2`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Email = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-top: 5px;
`;

const EditProfile = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  margin-top: 10px;
  font-size: 0.875rem;
  line-height: 1.25rem;

  label {
    display: block;
    color: ${({ theme }) => theme.textSoft};
    margin-bottom: 4px;
  }

  input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid ${({ theme }) => theme.soft};
    outline: 0;
    background-color: ${({ theme }) => theme.bg};
    padding: 0.75rem 1rem;
    color: ${({ theme }) => theme.text};

    &:focus {
      border-color: rgba(167, 139, 250, 1);
    }
  }
`;

const Settings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        const response = await apiClient.delete(
          `/users/${currentUser.data.user._id}`
        );

        if (response.status === 200) {
          toast.success("Account deleted successfully."); // Add this line if you're using toast notifications
          dispatch(logout());
          navigate("/sign-in");
        } else {
          toast.error("Failed to delete the account."); // Add this line if you're using toast notifications
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("An error occurred while deleting the account."); // Add this line if you're using toast notifications
      }
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await apiClient.post(`/users/changepassword/${path}`, {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Failed to change the password.");
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      toast.error("An error occurred while changing the password.");
    }
  };

  return (
    <Container>
      <Section>
        <Title>Account</Title>
        <AvatarContainer>
          <Avatar>
            <img src={currentUser?.data?.user?.avatar} alt="Avatar" />
          </Avatar>
          <UserInfo>
            <Name>{currentUser?.data?.user?.name}</Name>
            <Email>{currentUser?.data?.user?.email}</Email>
            <Username>@{currentUser?.data?.user?.username}</Username>
          </UserInfo>
        </AvatarContainer>
      </Section>
      <EditProfile>
        If you want to make changes in your account.{" "}
        <Link to={`/profile/${currentUser?.data?.user?._id}`}>
          Edit Profile
        </Link>
      </EditProfile>
      <Section>
        <Title>Change Password</Title>
        <InputGroup>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </InputGroup>
        <SaveButton onClick={handleChangePassword}>Save Changes</SaveButton>
      </Section>
      <Section>
        <Title>Delete Account</Title>
        <EditProfile>If you want to delete the account.</EditProfile>
        <DeleteButton onClick={handleDeleteAccount}>
          <span className="button__text">Delete</span>
          <span className="button__icon">
            <svg
              className="svg"
              height="512"
              viewBox="0 0 512 512"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title></title>
              <path
                d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              ></path>
              <line
                style={{
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeMiterlimit: "10",
                  strokeWidth: "32px",
                }}
                x1="80"
                x2="432"
                y1="112"
                y2="112"
              ></line>
              <path
                d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              ></path>
              <line
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
                x1="256"
                x2="256"
                y1="176"
                y2="400"
              ></line>
              <line
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
                x1="184"
                x2="192"
                y1="176"
                y2="400"
              ></line>
              <line
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
                x1="328"
                x2="320"
                y1="176"
                y2="400"
              ></line>
            </svg>
          </span>
        </DeleteButton>
      </Section>
    </Container>
  );
};

export default Settings;
