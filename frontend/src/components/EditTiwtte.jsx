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

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 15px;
  border: 1px solid ${({ theme }) => theme.textSoft};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  resize: none;
`;

const EditTiwtte = ({ setOpen, tiwtteId }) => {
  const [formData, setFormData] = useState({
    content: "",
    image: null,
    imageFileName: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTiwtteData = async () => {
      try {
        const response = await apiClient.get(`/tiwttes/find/${tiwtteId}`);
        const tiwtteData = response.data;
        setFormData({
          content: tiwtteData.desc,
          image: null,
          imageFileName: tiwtteData.image || "",
        });
      } catch (error) {
        console.error("Failed to fetch tiwtte data:", error);
        setError("Failed to fetch tiwtte data. Please try again.");
        toast.error("Failed to fetch tiwtte data. Please try again.");
      }
    };

    fetchTiwtteData();
  }, [tiwtteId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
      imageFileName: file.name,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = { desc: formData.content };
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append("postImage", formData.image); // Changed key to match the backend
        const imageResponse = await apiClientMultipart.patch(
          `/tiwttes/image/${tiwtteId}`,
          imageFormData
        );
        data.image = imageResponse.data.data.avatar; // Match the key with backend response
      }

      const response = await apiClient.put(`/tiwttes/${tiwtteId}`, data);
      console.log("Tiwtte updated:", response.data);
      setOpen(false);
      toast.success("Tiwtte updated successfully.");
    } catch (error) {
      console.error("Failed to update tiwtte:", error);
      setError("Failed to update tiwtte. Please try again.");
      toast.error("Failed to update tiwtte. Please try again.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Edit Your Tiwtte</Title>
        <Close onClick={() => setOpen(false)}>
          <CloseIcon />
        </Close>
        <TextArea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Write your Tiwtte here..."
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <FileUploader
          name={"Tiwtte Image"}
          value={formData.image}
          id="file"
          fileName={formData.imageFileName}
          onChange={handleFileChange}
          accept="image/*"
        />
        <Button1 onClick={handleSubmit} variant="contained">
          Save
        </Button1>
      </Wrapper>
    </Container>
  );
};

export default EditTiwtte;
