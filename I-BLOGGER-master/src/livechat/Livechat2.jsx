
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import './Livechat.css'

const socket = io.connect("http://localhost:8000");

function Livechat2() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
      <>
      <div className="shedow">
      <section className="section" id="trainers">
        <div className="container">
            <br/>
            <br/>
            <div className="row">
      <div className="col-md-4 col-sm-6">
                    <div className="trainer-item">
                        <div className="image-thumb">
                            <img src="./image/team-image-4-646x680.jpg" alt=""/>
                        </div>
                        <div className="down-content">
                            <span>Advisor</span>
                            <h4>Axit Balar</h4>
                            <p>Vestibulum id est eu felis vulputate hendrerit. Suspendisse dapibus turpis in dui pulvinar imperdiet. Nunc consectetur.</p>
                            <ul className="social-icons">
                                <li><a href="https://www.facebook.com/axit.balar.1"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="https://twitter.com/Axit3810"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="https://www.linkedin.com/in/axit-balar-139637232/"><i className="fa fa-linkedin"></i></a></li>
                                {/* <li><a href="#"><i className="fa fa-behance"></i></a></li> */}
                            </ul>
                        </div>
                    </div>
                </div>
              </div>
              </div>
              </section>

    
    <div className="livechat">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Enter Your Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room Id Must Be 95105"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
    </div>
    </>
  );
}

export default Livechat2;
