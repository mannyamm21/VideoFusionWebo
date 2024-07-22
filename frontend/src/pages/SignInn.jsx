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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import apiClient from "../apiClient";
import { toast } from "react-hot-toast";

const Container = styled1.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  padding: 20px;
`;

const FormContainer = styled1.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  max-width: 420px;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 30px;
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

  .visibility-icon {
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 25%;
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
    margin-left: 4px;
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
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await apiClient.post("/auth/sign-in", { username, password });
      if (res.data.success) {
        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("persist:root", JSON.stringify(res.data));
        dispatch(loginSuccess(res.data));
        toast.success("Login Successful");
        navigate("/");
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      toast.error("Username or Password are incorrect");
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await apiClient.post("/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
      });

      if (res.data.success) {
        const { accessToken } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("persist:root", JSON.stringify(res.data));
        dispatch(loginSuccess(res.data));
        toast.success("Login Successful");
        navigate("/");
      } else {
        console.error(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during login. Please try again.");
      dispatch(loginFailure());
    }
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
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="visibility-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>
            <ForgotPassword>
              <Link rel="noopener noreferrer" to="/forgot-password">
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
          <GoogleIcon
            onClick={signInWithGoogle}
            style={{ marginRight: "15px", marginLeft: "15px" }}
          />
          <XIcon style={{ marginRight: "15px", marginLeft: "15px" }} />
          <GitHubIcon style={{ marginRight: "15px", marginLeft: "15px" }} />
        </SocialIcons>
        <SignupText>
          Dontt have an account? <Link to="/sign-up">Sign Up</Link>
        </SignupText>
      </FormContainer>
    </Container>
  );
}
