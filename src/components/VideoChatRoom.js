import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import ChatRoomNav from "./ChatRoomNav";
import { history } from "../redux/configureStore";
import { actionCreators as userActions } from "../redux/modules/user";
import { actionCreators as groupAction } from "../redux/modules/group";

const ChatRoom = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #262524;
  #video-grid {
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    overflow: hidden;
    video {
      width: ${(props) => {
        switch (props.numberOfUsers) {
          case 1:
            return `100vh`;
          case 2:
            return `46%`;
          case 3:
            return `30%`;
          case 4:
            return `46%`;
          case 5:
            return `30%`;
          case 6:
            return `30%`;
          default:
            return `100%`;
        }
      }};
      height: ${(props) => {
        switch (props.numberOfUsers) {
          case 1:
            return `auto`;
          case 2:
            return `45vh`;
          case 3:
            return `45vh`;
          case 4:
            return `45vh`;
          case 5:
            return `45vh`;
          case 6:
            return `45vh`;
          default:
            return `100%`;
        }
      }};
      object-fit: cover;
    }
  }
`;

export default function VideoChatRoom() {
  // Global
  const dispatch = useDispatch();
  let userId = localStorage.getItem("id");
  let userNick = localStorage.getItem("nick");
  const params = useParams();
  const roomId = params.roomId;

  useEffect(() => {
    dispatch(groupAction.enterRoom(roomId));
  }, []);

  // Local
  const [cameraOn, setCameraOn] = useState(true);
  const [roomClosed, setRoomClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState(1);
  // const username = user
  //   ? user.username
  //   : `GUEST${Math.round(Math.random() * 100000)}`;

  let myStream = null;
  let myPeerId = "";
  let allStream = useRef();

  const videoGrid = useRef();
  const myVideo = useRef();

  // TODO
  // const [todoOpen, setTodoOpen] = useState(false);

  const handleCamera = () => {
    setCameraOn((prev) => !prev);
    if (cameraOn) {
      let video = allStream.current.getTracks();
      video[0].enabled = false;
    } else {
      let video = allStream.current.getTracks();
      video[0].enabled = true;
    }
  };

  // const toggleTodo = () => {
  //   setTodoOpen(!todoOpen);
  // };

  useEffect(() => {
    const socket = io("http://13.209.3.61");
    const peer = new Peer({
      config: {'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
       
      ]}
    });

    // 클라의 영상 스트림 비디오에 넣기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        let streamId = stream.id;
        myStream = stream;
        addVideoStream(myVideo.current, stream);
        videoGrid.current.append(myVideo.current);
        setIsLoading(false);
        allStream.current = stream;
        // 타이머 이벤트
        let gapTimeFloor;

        socket.on("restTime", (currentRound, totalRound, time) => {
          console.log(currentRound, totalRound, time);
          const endTime = time;
          const nowTime = new Date().getTime();
          const gapTime = endTime - nowTime;
          console.log(gapTime);
          gapTimeFloor = Math.floor(gapTime / 1000);
          let MinTime = Math.floor(gapTime / (1000 * 60));
          let secTime = Math.floor((gapTime % (1000 * 60)) / 1000);
          // console.log(MinTime, secTime, gapTimeFloor);
          let timer = () => {
            gapTimeFloor = gapTimeFloor - 1;
            console.log(gapTimeFloor);
            let min = Math.floor(gapTimeFloor / 60);
            let sec = gapTimeFloor % 60;
            console.log(`남은 시간은 ${min}분 ${sec}초 입니다.`, "쉬는시간");
            if (min === 0 && sec === 0) {
              console.log(currentRound, totalRound);
              console.log("쉬는시간 종료");
              currentRound = currentRound + 1;
              console.log(currentRound, "현재 라운드");
              socket.emit("endRest", roomId, currentRound);
              clearInterval(restinterval);
            }
          };
          const restinterval = setInterval(timer, 1000);
        });

        socket.on("studyTime", (currentRound, totalRound, time) => {
          console.log(time);
          const endTime = time;
          const nowTime = new Date().getTime();
          const gapTime = endTime - nowTime;
          gapTimeFloor = Math.floor(gapTime / 1000);
          let MinTime = Math.floor(gapTime / (1000 * 60));
          let secTime = Math.floor((gapTime % (1000 * 60)) / 1000);
          // console.log(MinTime, secTime, gapTimeFloor);
          let timer = () => {
            gapTimeFloor = gapTimeFloor - 1;
            console.log(gapTimeFloor);
            let min = Math.floor(gapTimeFloor / 60);
            let sec = gapTimeFloor % 60;
            console.log(`남은 시간은 ${min}분 ${sec}초 입니다.`, "수업시간");
            if (min === 0 && sec === 0) {
              console.log(
                currentRound,
                totalRound,
                "현재 라운드와 토탈 라운드"
              );
              console.log("수업시간 종료");
              if (currentRound !== totalRound) {
                socket.emit("endStudy", roomId, userId, userNick);
                console.log("endStudy 발생");
              }
              if (currentRound === totalRound) {
                socket.emit("totalEnd", roomId, userId, userNick);
              }
              clearInterval(studyinterval);
            }
          };
          const studyinterval = setInterval(timer, 1000);
        });

        socket.on("totalEnd", (time) => {
          const endTime = time;
          const nowTime = new Date().getTime();
          const gapTime = endTime - nowTime;
          gapTimeFloor = Math.floor(gapTime / 1000);
          let MinTime = Math.floor(gapTime / (1000 * 60));
          let secTime = Math.floor((gapTime % (1000 * 60)) / 1000);
          // console.log(MinTime, secTime, gapTimeFloor);
          let timer = () => {
            gapTimeFloor = gapTimeFloor - 1;
            console.log(gapTimeFloor);
            let min = Math.floor(gapTimeFloor / 60);
            let sec = gapTimeFloor % 60;
            console.log(
              `남은 시간은 ${min}분 ${sec}초 입니다.`,
              "수고하셨습니다."
            );
            if (min === 0 && sec === 0) {
              clearInterval(goodByeinterval);
              // socketRef.current.emit("removeRoom", roomId);
              history.push("/");
            }
          };
          const goodByeinterval = setInterval(timer, 1000);
        });

        // 피어 생성하기

        peer.on("open", (peerId) => {
          //소켓을 통해 서버로 방ID, 유저ID 보내주기
          myPeerId = peerId;
          socket.emit("join-room", roomId, peerId, userId, userNick, streamId);

          //전역변수 chatroom.participants에 본인 더하기
        });

        // 새로운 피어가 연결을 원할 때
        peer.on("call", (mediaConnection) => {
          //answer()를 해야 mediaConnection이 활성화됨
          mediaConnection.answer(stream);
          const newVideo = document.createElement("video");
          newVideo.setAttribute("autoplay", "playsinline");

          mediaConnection.on("stream", (newStream) => {
            addVideoStream(newVideo, newStream);
            videoGrid.current.append(newVideo);
            setUsers(videoGrid.current.childElementCount);
          });

          mediaConnection.on("close", () => {
            socket.emit("camera-off", myPeerId, userNick);
          });
        });

        socket.on("user-connected", (peerId, userNick, streamId) => {
          console.log(peerId, userNick, streamId);
          setUsers((prev) => prev + 1);
          const mediaConnection = peer.call(peerId, stream);
          const newVideo = document.createElement("video");
          // newVideo.setAttribute("id", `${peerId}`);

          mediaConnection.on("stream", (newStream) => {
            addVideoStream(newVideo, newStream);
            videoGrid.current.append(newVideo);
            setUsers(videoGrid.current.childElementCount);
          });
        });
      });

    socket.on("user-disconnected", (peerId, userNick, streamId) => {
      setUsers((prev) => prev - 1);
      const video = document.querySelectorAll("video");
      let removeVideo;
      for (let i = 0; i < video.length; i++) {
        if (video[i].srcObject.id === streamId) {
          removeVideo = video[i];
        }
      }

      removeVideo.remove();
    });

    // 테스팅 필요
    return function cleanup() {
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
      socket.disconnect();
      peer.destroy();
    };
  }, []);
  // if (userInfo == null) {
  //   return <></>;
  // }
  return (
    <>
      <ChatRoomNav
        cameraOn={cameraOn}
        handleCamera={handleCamera}
        // toggleTodo={toggleTodo}
      />
      <ChatRoom numberOfUsers={users}>
        {isLoading && <span>Loading...</span>}
        <div ref={videoGrid} id="video-grid">
          <video ref={myVideo} autoPlay playsInline></video>
        </div>
      </ChatRoom>
    </>
  );
}

// 영상 스트림을 DOM 비디오 엘리먼트에 넣어주는 함수
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
}
