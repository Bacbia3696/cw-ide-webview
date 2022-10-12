import React from "react";
import * as ReactDOM from "react-dom";
import Keplr from "src/lib/Keplr";
import App2 from "src/Test";

import App from "./App";
import { EmbedChainInfos } from "./config";
import "./index.css";
import "./polyfill";
import { ChainStore } from "./stores/chain";

window.chainStore = new ChainStore(EmbedChainInfos);

// export default Keplr;
// global Keplr

window.Keplr = new Keplr();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
