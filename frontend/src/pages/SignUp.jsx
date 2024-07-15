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
import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

const Container = styled1.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const FormContainer = styled1.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 420px;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
  color: ${({ theme }) => theme.textSoft};
`;

const Title = styled1.p`
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
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

const ForgotPassword = styled1.div`
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  line-height: 1rem;
  color: ${({ theme }) => theme.textSoft};
  margin: 8px 0 14px 0;

  a {
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-decoration: underline rgba(167, 139, 250, 1);
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
`;

const SocialMessage = styled1.div`
  display: flex;
  align-items: center;
  padding-top: 1rem;

  .line {
    height: 1px;
    flex: 1 1 0%;
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

      const res = await apiClient.post("/auth/sign-up", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Assuming your response has accessToken and refreshToken
      const { accessToken, refreshToken } = res.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      dispatch(loginSuccess(res.data.data));
      toast.success("Signed Up Successful");
      navigate("/"); // Assuming res.data.data contains the user object

      console.log(res.data);
    } catch (error) {
      dispatch(loginFailure());
      console.error("Failed to sign up:", error);
      toast.error("An error occurred during login. Please try again.");
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
            <ForgotPassword></ForgotPassword>
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
          <ForgotPassword></ForgotPassword>
          <Button1 className="sign" onClick={handleSignUp}>
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
            {/* Twitter SVG */}
            <XIcon />
          </button>
          <button aria-label="Log in with GitHub" className="icon">
            {/* GitHub SVG */}
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
