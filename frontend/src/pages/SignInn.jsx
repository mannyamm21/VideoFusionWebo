import styled1 from "styled-components";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../Context/userSlice";
import { auth, provider } from "../lib/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
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
  margin-top: 10px;

  .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    color: ${({ theme }) => theme.bg};
    background-color: transparent;
    margin-left: 8px;
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

export default function SignInn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await apiClient.post("/auth/sign-in", {
        username,
        password,
      });
      if (res.ok) {
        console.log("User logged in successfully");
        // Redirect or update UI
      } else {
        console.error(res.data.message);
      }
      dispatch(loginSuccess(res.data));
      toast.success("Login Successful");
      navigate("/"); // Assuming res.data.data contains the user object
      console.log(res.data);
    } catch (error) {
      toast.error("An error occurred during login. Please try again.");
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        apiClient
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res);
            dispatch(loginSuccess(res.data.data));
            toast.success("Login Successful");
            navigate("/"); // Assuming res.data.data contains the user object
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred during login. Please try again.");
        dispatch(loginFailure());
      });
  };

  return (
    <Container>
      <FormContainer>
        <Title>Sign In</Title>
        <Form>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <ForgotPassword>
              <Link rel="noopener noreferrer" to="#">
                Forgot Password?
              </Link>
            </ForgotPassword>
          </InputGroup>
          <Button1 className="sign" onClick={handleLogin}>
            Sign In
          </Button1>
        </Form>
        <SocialMessage>
          <div className="line"></div>
          <p className="message">Login with social accounts</p>
          <div className="line"></div>
        </SocialMessage>
        <SocialIcons>
          <button
            aria-label="Log in with Google"
            className="icon"
            onClick={signInWithGoogle}
          >
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
          Dont have an account? <Link to="/sign-up">Sign Up</Link>
        </SignupText>
      </FormContainer>
    </Container>
  );
}
