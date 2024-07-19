import styled1 from "styled-components";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  margin-bottom: 15px;
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
`;

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password,
      });
      toast.success("Password has been reset successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Reset Password</Title>
        <Form onSubmit={handleResetPassword}>
          <InputGroup>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>
          <Button1 type="submit">Reset Password</Button1>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default ResetPassword;
