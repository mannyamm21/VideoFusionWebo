import Modal from "react-modal";
import { useSelector } from "react-redux";
import { ShareSocial } from "react-share-social";
import CopyToClipboard from "react-copy-to-clipboard";
import styled from "styled-components";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const ShareContainer = styled.div`
  width: 600px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: white;
  border-radius: 10px;
`;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px 0px 20px",
    borderRadius: "10px",
  },
};

const ShareModal = ({ isOpen, onRequestClose }) => {
  const { currentVideo } = useSelector((state) => state.video);
  const videoUrl = `${window.location.origin}/video/${currentVideo?._id}`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <ShareContainer>
        <ShareSocial
          url={videoUrl}
          socialTypes={[
            "facebook",
            "twitter",
            "whatsapp",
            "linkedin",
            "telegram",
          ]}
        />
        <CopyToClipboard text={videoUrl}>
          <ContentCopyIcon />
        </CopyToClipboard>
      </ShareContainer>
    </Modal>
  );
};

export default ShareModal;
