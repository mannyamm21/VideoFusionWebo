import styled from "styled-components";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const Input = styled.input`
  max-width: 190px;
  display: none;
`;

const LabelFile = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 560px;
  height: 190px;
  border: 2px dashed ${({ theme }) => theme.soft};
  align-items: center;
  text-align: center;
  padding: 5px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  svg {
    width: 60px;
    height: 60px;
  }
`;

const FileUploader = ({ id, fileName, onChange, name }) => {
  return (
    <>
      <LabelFile htmlFor={id}>
        <span>
          <CloudUploadIcon />
        </span>
        <h4>{name}</h4>
        <p>
          {fileName ||
            "drag and drop your file here or click to select a file!"}
        </p>
      </LabelFile>
      <Input name="text" id={id} type="file" onChange={onChange} />
    </>
  );
};

export default FileUploader;
