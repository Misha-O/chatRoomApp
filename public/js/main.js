const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const chatInput = document.getElementById("msg");
const feedback = document.getElementById("feedback");

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// listen for events received from server, which before we received from user actions and send to the server
socket.on("message", (message) => {
  feedback.innerHTML = ""; //because this event occurs after clicked send, we clear 'typing' input here

  outputMessage(message);

  //   scroll down on msg
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// typing msg, listen for input
chatInput.addEventListener("keypress", () => {
  socket.emit("typing", { username });
});

socket.on("typing", (data) => {
  feedback.innerHTML = `<p><em>${data.username} is typing a message ...</em></p>`;
});

// msg submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get msg text
  const msg = e.target.elements.msg.value;

  //   emitting msg to server
  socket.emit("chatMessage", msg);

  //   clear msg inputs
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<div class="meta">${message.username}  <span>${message.time}</span></div>
  <div class="text">${message.text}</div>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputRoomUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
