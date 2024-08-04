import { useState } from "react";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import FileUploader from "./FileUploader";
import apiClient from "../apiClient";

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
  height: auto;
  max-height: 80vh;
  border-radius: 7px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow-y: auto;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
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

const Label = styled.label`
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 13px;
  background-color: #2cb5a0;
  color: ${({ theme }) => theme.text};
`;

export default function UploadTiwtte({ setOpen }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Tiwtte content cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("desc", content);
    if (image) {
      formData.append("postImage", image); // Make sure 'file' matches the backend configuration
    }

    try {
      await apiClient.post("/tiwttes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Tiwtte uploaded successfully!");
      setContent(""); // Clear the form
      setImage(null); // Clear the image file
      setOpen(false); // Close the upload form
    } catch (error) {
      console.error("Error uploading Tiwtte:", error);
      toast.error("Failed to upload Tiwtte");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>
          <CloseIcon />
        </Close>
        <Title>Upload Tiwtte</Title>
        <form onSubmit={handleSubmit}>
          <Label>Description:</Label>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your Tiwtte here..."
          />
          <FileUploader
            name={"Tiwtte Image"}
            value={image}
            id="file" // Make sure the id is 'file'
            fileName={imageFileName}
            onChange={handleFileChange}
            accept="image/*"
          />
          <Button type="submit">Post The Tiwtte</Button>
        </form>
      </Wrapper>
    </Container>
  );
}
