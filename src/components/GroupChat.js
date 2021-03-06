import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import OneChatList from "./OneChatList";
import icon_lock from "../Images/chat-lock_2.png";
import send from "../Images/ic-send 1.png";
import "../styles/css/chat.css";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();
function GroupChat({ openChat }) {
  const [chatMessage, setChatMessage] = useState("");
  const url = process.env.REACT_APP_API_URL;
  const params = useParams();
  const roomId = params.roomId;
  let userId = localStorage.getItem("nick");
  const socket = useRef();
  const oneChat = useRef();
  const renderOneChat = oneChat.current;
  const [chat, setChat] = useState([]);
  useEffect(() => {
    socket.current = io(url);
    socket.current.emit("join-chatRoom", roomId, userId);
    socket.current.on("message", (user, message) => {
      setChat([...chat, { user, message }]);
      // // 돔을 직접 건드리는 방법
      // const chat_from_friend = document.createElement("div");
      // userId == user
      //   ? chat_from_friend.classList.add("chat_from_me")
      //   : chat_from_friend.classList.add("chat_from_friend");
      // //
      // let chat_nick;
      // if (userId != user) {
      //   chat_nick = document.createElement("div");
      //   chat_nick.classList.add("chat_nick");
      //   chat_nick.innerText = user;
      // }
      // //
      // const chat_content = document.createElement("div");
      // chat_content.classList.add("chat_content");
      // //
      // chat_from_friend.prepend(chat_content);
      // if (chat_from_friend.classList[0] === "chat_from_friend") {
      //   chat_from_friend.prepend(chat_nick);
      // }
      // //
      // const chat_message = document.createElement("p");
      // chat_message.classList.add("chat_message");
      // chat_message.innerText = message;
      // //
      // chat_content.prepend(chat_message);
      // //
      // const chat_render_oneChat = document.querySelector(
      //   ".chat_render_oneChat"
      // );
      // chat_render_oneChat.append(chat_from_friend);
      // chat_render_oneChat.lastChild.scrollIntoView();
    });
    return () => {
      socket.current.disconnect();
    };
  }, [chat]);

  const sendChat = () => {
    if (chatMessage != "") {
      socket.current.emit("message", userId, chatMessage, roomId);
      setChatMessage("");
    }
  };

  const sendMessage = (e) => {
    setChatMessage(e.target.value);
  };
  //
  const renderChat = () => {
    return chat.map(({ user, message }, index) => (
      <div
        key={index}
        className={userId == user ? "chat_from_me" : "chat_from_friend"}
      >
        {userId != user ? <div className="chat_nick">{user}</div> : null}
        <div className="chat_content">
          <div className="chat_message">{message}</div>
        </div>
      </div>
    ));
  };
  const viewBottom = () => {
    renderOneChat?.lastChild?.lastChild.scrollIntoView();
  };
  return (
    <>
      <ChatContainer>
        <BlockChat className={openChat}>
          <div className="blockBG"></div>
          <img src={icon_lock} alt="집중시간" />
        </BlockChat>
        <p className="header_modal_title">그룹채팅</p>
        <div className="header_modal_hr"></div>

        <div className="group_chat_container">
          <div className="chat_render_oneChat" ref={oneChat}>
            {renderChat()}
            {viewBottom()}
          </div>
          <div className="chat_textfield_container">
            <input
              type="text"
              className="chat_textfield"
              placeholder="메시지를 작성해주세요."
              name="oneChat"
              value={chatMessage}
              onChange={sendMessage}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendChat();
                }
              }}
            />
            <span className="chat_send_btn">
              <img src={send} alt="" onClick={sendChat} />
            </span>
          </div>
        </div>
      </ChatContainer>
    </>
  );
}

export default GroupChat;

const ChatContainer = styled.div`
  position: relative;
  height: 85vh;
  margin: 0 4.17vw;
  box-shadow: 0px 4px 35px 4px rgba(162, 162, 162, 0.25);
  border-radius: 16px;
  box-sizing: border-box;
  width: 22%;

  .group_chat_container {
    padding: 18px;
    height: calc(100% - 150px);
  }
  .chat_render_oneChat {
    height: 100%;
    overflow: auto;
  }
  .chat_textfield_container {
    position: absolute;
    bottom: 20px;
    width: 92%;
    left: 50%;
    transform: translateX(-50%);
  }
  .header_modal_title {
    margin: 3.07vh 18px 2.56vh;
  }
`;

const BlockChat = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
  text-align: center;
  z-index: 1;

  > .blockBG {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    opacity: 0.8;
    border-radius: 16px;
  }
  > img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4.17vw;
    opacity: 1;
    z-index: 1;
  }

  &&.focusTime {
    display: block;
  }
`;
