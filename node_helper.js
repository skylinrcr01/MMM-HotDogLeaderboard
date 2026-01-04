const NodeHelper = require("node_helper");
const https = require("https");

function fetchJson(url, onSuccess, onError) {
  const request = https.get(url, (response) => {
    if (response.statusCode !== 200) {
      response.resume();
      onError(`HTTP ${response.statusCode}`);
      return;
    }

    let rawData = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => {
      rawData += chunk;
    });
    response.on("end", () => {
      try {
        const parsed = JSON.parse(rawData);
        onSuccess(parsed);
      } catch (error) {
        onError("Invalid JSON response");
      }
    });
  });

  request.on("error", (error) => {
    onError(error.message);
  });

  request.setTimeout(10000, () => {
    request.destroy();
    onError("Request timed out");
  });
}

module.exports = NodeHelper.create({
  socketNotificationReceived: function (notification, payload) {
    if (notification !== "GET_LEADERBOARD") return;

    const url = payload && payload.url;
    if (!url) {
      this.sendSocketNotification("LEADERBOARD_ERROR", "Missing API URL");
      return;
    }

    fetchJson(
      url,
      (data) => {
        this.sendSocketNotification("LEADERBOARD_DATA", data);
      },
      (errorMessage) => {
        this.sendSocketNotification("LEADERBOARD_ERROR", errorMessage);
      }
    );
  }
});
