import styled from "styled-components";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import TiwttePost from "../components/TiwttePost";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: 1200px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;
export default function Tiwttes() {
  const [tiwttes, setTiwttes] = useState([]);

  useEffect(() => {
    const fetchTiwtte = async () => {
      try {
        const res = await apiClient.get(`tiwttes/all`);
        setTiwttes(res.data);
      } catch (error) {
        console.error("Error fetching tiwtte:", error); // Log the error
      }
    };
    fetchTiwtte();
  });
  return (
    <Container>
      {tiwttes.map((tiwtte) => (
        <TiwttePost key={tiwtte._id} post={tiwtte} />
      ))}
    </Container>
  );
}
