import { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./lib/utils/Theme";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import SavedVideo from "./components/SavedVideo";
import SignUp from "./pages/SignUp";
import SignInn from "./pages/SignInn";
import Settings from "./pages/Settings";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/Resetpassword";
import TiwttePage from "./pages/TiwttePage";
import Tiwttes from "./pages/Tiwttes";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  min-height: 100vh; /* Ensure the container fills the viewport height */
  flex-direction: column;
`;

const Main = styled.div`
  flex: 1; /* Allow Main to grow and fill the remaining space */
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  margin-left: 150px;
  padding: 22px 96px;
  min-height: calc(
    100vh - 56px
  ); /* Adjust to ensure the Wrapper fills the height of the Main */
  background-color: ${({ theme }) =>
    theme.bg}; /* Apply background color from theme */
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu />
          <Main>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="trend" element={<Home type="trend" />} />
                  <Route path="all" element={<Tiwttes />} />
                  <Route path="sub" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="category/:category" element={<Categories />} />
                  <Route path="savedVideos/:userId" element={<SavedVideo />} />
                  <Route path="settings/:id" element={<Settings />} />
                  <Route
                    path="sign-up"
                    element={currentUser ? <Home /> : <SignUp />}
                  />
                  <Route path="sign-in" element={<SignInn />} />
                  <Route path="video/:id" element={<Video />} />
                  <Route path="tiwtte/:id" element={<TiwttePage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
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
