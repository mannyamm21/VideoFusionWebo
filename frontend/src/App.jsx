import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./lib/utils/Theme";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
// import { useSelector } from "react-redux";
import Categories from "./pages/Categories";
import SavedVideo from "./components/SavedVideo";
import SignUp from "./pages/SignUp";
import SignInn from "./pages/SignInn";
import Settings from "./pages/Settings";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  // const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="trend" element={<Home type="trend" />} />
                  <Route path="sub" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="category/:category" element={<Categories />} />
                  <Route path="savedVideos/:userId" element={<SavedVideo />} />
                  <Route path="settings/:id" element={<Settings />} />
                  <Route path="sign-up" element={<SignUp />} />
                  <Route path="sign-in" element={<SignInn />} />
                  <Route path="video/:id" element={<Video />} />
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
