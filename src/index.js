import React from "react";
import ReactDOM from "react-dom/client";
import './../src/i18n';  // Import i18n
// import "./index.css";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import { AuthProvider } from "./auth/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
