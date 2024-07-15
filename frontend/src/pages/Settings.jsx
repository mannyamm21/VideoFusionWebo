import { useSelector } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.soft};
  padding-bottom: 5px;
`;

const Hr = styled.hr`
  margin: 20px 0;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const Name = styled.h2`
  font-size: 24px;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const Email = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-top: 5px;
`;

const EditProfile = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  margin-top: 10px;
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

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2cb5a0;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #249f8f;
  }
`;

const DeleteButton = styled.button`
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #cc0000;
  background-color: #ff3131;
  overflow: hidden;
  border-radius: 10px;
  transition: all 0.3s;

  .button__text {
    transform: translateX(35px);
    color: #fff;
    font-weight: 600;
    transition: all 0.3s;
  }

  .button__icon {
    position: absolute;
    transform: translateX(109px);
    height: 100%;
    width: 39px;
    background-color: #cc0000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    .svg {
      width: 20px;
    }
  }

  &:hover {
    background: #cc0000;

    .button__text {
      color: transparent;
    }

    .button__icon {
      width: 148px;
      transform: translateX(0);
    }
  }

  &:active {
    border: 1px solid #b20000;

    .button__icon {
      background-color: #b20000;
    }
  }
`;

const Settings = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Container>
      <Section>
        <Title>Account</Title>
        <AvatarContainer>
          <Avatar>
            <img src={currentUser?.user?.avatar} alt="Avatar" />
          </Avatar>
          <UserInfo>
            <Name>{currentUser.user?.name}</Name>
            <Email>{currentUser.user?.email}</Email>
            <Username>@{currentUser.user?.username}</Username>
          </UserInfo>
        </AvatarContainer>
      </Section>
      <EditProfile>
        If you want to make changes in your account.{" "}
        <Link to={`/profile/${currentUser.user?._id}`}>
          Edit Proflie
          <EditIcon
            style={{ position: "absolute", top: "332px", right: "1085px" }}
          />
        </Link>
      </EditProfile>
      <Section>
        <Title>Change Password</Title>
        <InputGroup>
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            placeholder="Enter old password"
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
          />
        </InputGroup>
        <SaveButton>Save Changes</SaveButton>
      </Section>
      <Section>
        <Title>Delete Account</Title>
        <EditProfile>If you want to delete the account.</EditProfile>
        <DeleteButton>
          <span className="button__text">Delete</span>
          <span className="button__icon">
            <svg
              className="svg"
              height="512"
              viewBox="0 0 512 512"
              width="512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title></title>
              <path
                d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              ></path>
              <line
                style={{
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeMiterlimit: "10",
                  strokeWidth: "32px",
                }}
                x1="80"
                x2="432"
                y1="112"
                y2="112"
              ></line>
              <path
                d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
              ></path>
              <line
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
                x1="256"
                x2="256"
                y1="176"
                y2="400"
              ></line>
              <line
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
                x1="184"
                x2="192"
                y1="176"
                y2="400"
              ></line>
              <line
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "32px",
                }}
                x1="328"
                x2="320"
                y1="176"
                y2="400"
              ></line>
            </svg>
          </span>
        </DeleteButton>
      </Section>
    </Container>
  );
};

export default Settings;
