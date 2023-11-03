import { useState } from "react";
import { makeWsContainer } from "./ws";

function App() {
  const [wsClient, _setWsClient] = useState(makeWsContainer(Date.now()));

  return (
    <div className="App">
      <div>
        React app with WebSocket
      </div>
      <div>
        ...
      </div>
    </div>
  );
}

export default App;
