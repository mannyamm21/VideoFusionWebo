import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ChannelImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #999;
`;

const Title = styled.h1`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 18px;
  padding: 4px;
`;

export default function Subscribers({ userId }) {
  const [sub, setSub] = useState({});

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await apiClient.get(`/users/find/${userId}`);
        setSub(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSub();
  }, [userId]);

  return (
    <Container>
      {sub?.avatar ? (
        <ChannelImage src={sub?.avatar} />
      ) : (
        <ChannelImage as="div">{sub?.avatar?.charAt(0)}</ChannelImage>
      )}
      <Title>{sub?.name}</Title>
    </Container>
  );
}
