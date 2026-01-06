Module.register("MMM-HotDogLeaderboard", {
  defaults: {
    apiUrl: "https://example.com/api/leaderboard",
    updateInterval: 10 * 60 * 1000,
    maxEntries: 10,
    title: "Hot Dog Leaderboard",
    totalLabel: "Glizzies Gobbled",
    showRank: true
  },

  start: function () {
    this.leaderboard = [];
    this.loaded = false;
    this.error = null;

    this.getData();
    this.scheduleUpdate();
  },

  getStyles: function () {
    return ["MMM-HotDogLeaderboard.css"];
  },

  getData: function () {
    this.sendSocketNotification("GET_LEADERBOARD", {
      url: this.config.apiUrl
    });
  },

  scheduleUpdate: function () {
    setInterval(() => {
      this.getData();
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "LEADERBOARD_DATA") {
      this.leaderboard = payload || [];
      this.loaded = true;
      this.error = null;
      this.updateDom();
      return;
    }

    if (notification === "LEADERBOARD_ERROR") {
      this.error = payload || "Unable to load leaderboard.";
      this.loaded = true;
      this.updateDom();
    }
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "hotdog-leaderboard";

    const title = document.createElement("div");
    title.className = "hotdog-title";
    title.textContent = this.config.title;
    wrapper.appendChild(title);

    if (!this.loaded) {
      const loading = document.createElement("div");
      loading.className = "hotdog-loading";
      loading.textContent = "Loading...";
      wrapper.appendChild(loading);
      return wrapper;
    }

    if (this.error) {
      const error = document.createElement("div");
      error.className = "hotdog-error";
      error.textContent = this.error;
      wrapper.appendChild(error);
      return wrapper;
    }

    const table = document.createElement("table");
    table.className = "hotdog-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    if (this.config.showRank) {
      const rankHeader = document.createElement("th");
      rankHeader.className = "hotdog-rank";
      rankHeader.textContent = "#";
      headerRow.appendChild(rankHeader);
    }

    const nameHeader = document.createElement("th");
    nameHeader.className = "hotdog-name";
    nameHeader.textContent = "Name";
    headerRow.appendChild(nameHeader);

    const countHeader = document.createElement("th");
    countHeader.className = "hotdog-total";
    countHeader.textContent = "Dogs Eaten";
    headerRow.appendChild(countHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const maxEntries = Math.max(1, this.config.maxEntries);
    const visibleEntries = this.leaderboard.slice(0, maxEntries);
    const totalConsumed = this.leaderboard.reduce((sum, entry) => {
      const count = Number(entry.total_count);
      return sum + (Number.isFinite(count) ? count : 0);
    }, 0);

    visibleEntries.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.className = "hotdog-row";

      if (index === 0) row.classList.add("is-first");
      if (index === 1) row.classList.add("is-second");
      if (index === 2) row.classList.add("is-third");

      if (this.config.showRank) {
        const rankCell = document.createElement("td");
        rankCell.className = "hotdog-rank";
        rankCell.textContent = String(index + 1);
        row.appendChild(rankCell);
      }

      const nameCell = document.createElement("td");
      nameCell.className = "hotdog-name";
      nameCell.textContent = entry.username || "Unknown";
      row.appendChild(nameCell);

      const countCell = document.createElement("td");
      countCell.className = "hotdog-total";
      countCell.textContent = String(entry.total_count ?? 0);
      row.appendChild(countCell);

      tbody.appendChild(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.className = "hotdog-total-row";

    if (this.config.showRank) {
      const totalRank = document.createElement("td");
      totalRank.className = "hotdog-rank";
      totalRank.textContent = "";
      totalRow.appendChild(totalRank);
    }

    const totalLabel = document.createElement("td");
    totalLabel.className = "hotdog-name hotdog-total-label";
    totalLabel.textContent = this.config.totalLabel;
    totalRow.appendChild(totalLabel);

    const totalValue = document.createElement("td");
    totalValue.className = "hotdog-total";
    totalValue.textContent = String(totalConsumed);
    totalRow.appendChild(totalValue);

    tbody.appendChild(totalRow);

    table.appendChild(tbody);
    wrapper.appendChild(table);

    return wrapper;
  }
});
