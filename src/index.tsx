import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Keplr from "src/lib/Keplr";
import store from "src/stores/store";

import App from "./App";
import { EmbedChainInfos } from "./config";
import "./index.css";
import "./polyfill";
import { ChainStore } from "./stores/chain";

// TODO: move this to redux
window.chainStore = new ChainStore(EmbedChainInfos);
window.Keplr = new Keplr();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
