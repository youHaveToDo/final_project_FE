import React from "react";
import GlobalStyles from "./components/GlobalStyles";

import { Route } from "react-router-dom";
import "./styles/css/login.css";
import "./styles/css/signup.css";
import "./styles/css/group.css";
import "./styles/css/grouprecommend.css";
import "./styles/css/timer.css";
import "./styles/css/myInfo.css";
import "./styles/css/userview.css";
import "./styles/css/video.css";
import "./styles/css/certification.css";
import Login from "./page/Login";
import Signup from "./page/Singup";
import PostChat from "./components/PostChat";
import Group from "./page/Group";
import Header from "./components/Header";
import Main from "./page/Main";
import CertificationWrite from "./components/CertificationWrite";
import CertificationComment from "./components/CertificationComment";
import Certification from "./components/Certification";

function App() {
  return (
    <>
      <GlobalStyles />

      <Route path="/signup" exact component={Signup} />
      <Route path="/" exact component={Login} />
      <Header />
      <Route path="/chat" exact component={PostChat} />
      <Route path="/group" exact component={Group} />
      <Route path="/main/:userId" exact component={Main} />
      <Route path="/writemodal" exact component={CertificationWrite} />
      <Route path="/commentmodal" exact component={CertificationComment} />
      <Route path="/certifi" exact component={Certification} />
    </>
  );
}

export default App;
