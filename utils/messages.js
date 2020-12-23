function formatMessage(username, text) {
  return {
    username,
    text,
    time: getMsgTime(),
  };
}

function getMsgTime() {
  const date = new Date();
  let day = String(date.getDay());
  let hour = String(date.getHours()).padStart(2, 0);
  let minutes = String(date.getMinutes()).padStart(2, 0);

  switch (day) {
    case "1":
      day = "Monday";
      break;
    case "2":
      day = "Tuesday";
      break;
    case "3":
      day = "Wednesday";
      break;
    case "4":
      day = "Thursday";
      break;
    case "5":
      day = "Friday";
      break;
    case "6":
      day = "Saturday";
      break;
    case "7":
      day = "Sunday";
      break;

    default:
      day = "Perfect day";
      break;
  }

  const reviewTime = `${day} ${hour}:${minutes}`;
  return reviewTime;
}

module.exports = formatMessage;
