# MMM-HotDogLeaderboard

Simple MagicMirror² module that displays the hot dog leaderboard from the API endpoint.

## Installation

Copy this folder into `modules` in your MagicMirror² install, then add it to your `config.js`:

```js
{
  module: "MMM-HotDogLeaderboard",
  position: "top_right",
  config: {
    apiUrl: "https://example.com/api/leaderboard",
    updateInterval: 1000 * 60,
    maxEntries: 10,
    title: "Hot Dog Leaderboard",
    totalLabel: "Glizzies Gobbled",
    showRank: true
  }
}
```

## Options

- `apiUrl` (string): API endpoint for leaderboard data.
- `updateInterval` (number): Refresh interval in ms.
- `maxEntries` (number): Maximum number of rows to display.
- `title` (string): Module title.
- `totalLabel` (string): Label shown for the total row and column header.
- `showRank` (boolean): Show ranking numbers.
