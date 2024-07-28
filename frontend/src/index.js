import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import emp_store from "./redux/store";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={emp_store}>
        <App />
    </Provider>
);