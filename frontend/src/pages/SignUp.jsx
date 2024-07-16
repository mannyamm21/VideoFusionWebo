import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled1 from "styled-components";
import { loginFailure, loginSuccess } from "../Context/userSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import { toast } from "react-hot-toast";
import apiClientMultipart from "../apiClientMutipart";

const Container = styled1.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  padding: 20px; // Add padding for small screens
`;

const FormContainer = styled1.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%; // Use a percentage for better responsiveness
  max-width: 420px;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 30px; // Adjust padding for smaller screens
  gap: 10px;
  color: ${({ theme }) => theme.textSoft};

  @media (max-width: 768px) {
    padding: 15px 20px; // Reduce padding for smaller screens
  }
`;

const Title = styled1.p`
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.25rem; // Adjust font size for smaller screens
  }
`;

const Form = styled1.form`
  margin-top: 1.5rem;
  width: 320px;
`;

const InputGroup = styled1.div`
  margin-top: 0.25rem;
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

const Button1 = styled1.button`
  display: block;
  width: 100%;
  background-color: rgba(167, 139, 250, 1);
  padding: 0.75rem;
  text-align: center;
  color: ${({ theme }) => theme.bg};
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 0.65rem; // Slightly reduce padding for smaller screens
  }
`;

const SocialMessage = styled1.div`
  display: flex;
  align-items: center;
  padding-top: 1rem;

  .line {
    height: 1px;
    flex: 1;
    background-color: ${({ theme }) => theme.soft};
  }

  .message {
    padding: 0 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.textSoft};
  }
`;

const SocialIcons = styled1.div`
  display: flex;
  justify-content: center;

  .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    color: ${({ theme }) => theme.bg};
    background-color: transparent;
    margin-left: 8px;

    svg {
      height: 1.25rem;
      width: 1.25rem;
      fill: #fff;
    }
  }
`;

const SignupText = styled1.p`
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  color: ${({ theme }) => theme.textSoft};

  a {
    color: ${({ theme }) => theme.text};
    text-decoration: none;

    &:hover {
      text-decoration: underline rgba(167, 139, 250, 1);
    }
  }
`;

const VisuallyHiddenInput = styled1.input`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
// Main Login Form Component
const LoginForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Changed from string to file object
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await apiClientMultipart.post("/auth/sign-up", formData);
      // Assuming your response has accessToken and refreshToken
      dispatch(loginSuccess(res.data.data));
      toast.success("Signed Up Successfully");

      console.log("User signed up successfully:", res.data.data);
      navigate("/sign-in"); // Navigate to the home page after successful signup
    } catch (error) {
      dispatch(loginFailure());
      console.error("Failed to sign up:", error);
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
  };

  return (
    <Container>
      <FormContainer>
        <Title>Sign Up</Title>
        <Form>
          <InputGroup>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Avatar Image
            <VisuallyHiddenInput
              type="file"
              onChange={handleAvatarChange}
              accept="image/*"
            />
          </Button>
          <Button1 className="sign" type="button" onClick={handleSignUp}>
            Sign Up
          </Button1>
        </Form>
        <SocialMessage>
          <div className="line"></div>
          <p className="message">Login with social accounts</p>
          <div className="line"></div>
        </SocialMessage>
        <SocialIcons>
          <button aria-label="Log in with Google" className="icon">
            <GoogleIcon />
          </button>
          <button aria-label="Log in with Twitter" className="icon">
            <XIcon />
          </button>
          <button aria-label="Log in with GitHub" className="icon">
            <GitHubIcon />
          </button>
        </SocialIcons>
        <SignupText>
          I already have an account. <Link to="/sign-in">Sign In</Link>
        </SignupText>
      </FormContainer>
    </Container>
  );
};

export default LoginForm;
