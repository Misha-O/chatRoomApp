const users = [];

// join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// get current user
// pick out user with id that passed into this function
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// user leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  //   to check that it returns smth
  if (index !== -1) {
    //   return array without that user
    return users.splice(index, 1)[0]; // instead of array return one [0]
  }
}

// get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
