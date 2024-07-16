import { useState, useEffect } from "react";
import styled from "styled-components";
import apiClient from "../apiClient";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import FileUploader from "./FileUploader";
import apiClientMultipart from "../apiClientMutipart";
import { toast } from "react-hot-toast";

const Button1 = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: #2cb5a0;
  color: ${({ theme }) => theme.text};
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 620px;
  border-radius: 7px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow-y: auto;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 18px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  width: 100%;
`;

const EditProfile = ({ setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverFileName, setCoverFileName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user data and populate form fields
    const fetchUserData = async () => {
      try {
        const userId = currentUser?.data?.user?._id;
        const url = `/users/find/${userId}`;
        const response = await apiClient.get(url);
        const userData = response.data;

        // Populate form data
        setFormData({
          name: userData.name,
          username: userData.username,
          email: userData.email,
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch user data. Please try again.");
        toast.error("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarFileName(file.name);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    setCoverFileName(file.name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const userId = currentUser?.data?.user?._id;
      const url = `/users/${userId}`;
      const data = { ...formData };

      // Update avatar image if selected
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        const avatarResponse = await apiClientMultipart.patch(
          `/users/avatar/${userId}`,
          avatarFormData
        );
        data.avatarUrl = avatarResponse.data.avatarUrl;
      }

      // Update cover image if selected
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append("coverImage", coverFile);
        const coverResponse = await apiClientMultipart.patch(
          `/users/coverImage/${userId}`,
          coverFormData
        );
        data.coverImageUrl = coverResponse.data.coverImageUrl;
      }

      // Update user details (name, username, email)
      const response = await apiClient.put(url, data);
      console.log("Profile updated:", response.data);
      setOpen(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Edit Your Profile</Title>
        <Close onClick={() => setOpen(false)}>
          <CloseIcon />
        </Close>
        <Input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          placeholder={formData.email}
          name="email"
          onChange={handleInputChange}
          disabled
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <FileUploader
          name={"Avatar Image"}
          id="avatarFile"
          fileName={avatarFileName}
          onChange={handleAvatarChange}
        />
        <FileUploader
          name={"Cover Image"}
          id="coverFile"
          fileName={coverFileName}
          onChange={handleCoverChange}
        />
        <Button1 onClick={handleSubmit} variant="contained">
          Save
        </Button1>
      </Wrapper>
    </Container>
  );
};

export default EditProfile;
