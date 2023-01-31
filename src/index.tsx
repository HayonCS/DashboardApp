import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main";
import { Dashboard } from "./pages/Dashboard";
import { RomboDashboard } from "./pages/RomboDashboard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/Dashboard/Rombo5"
        element={
          <RomboDashboard
            name="Rombo 5"
            asset1="CMB-J073"
            asset2="CMB-J071"
            asset3="CMB-J078"
          />
        }
      />
      <Route
        path="/Dashboard/Rombo3"
        element={
          <RomboDashboard
            name="Rombo 3"
            asset1="CMB-J143"
            asset2="CMB-J142"
            asset3="CMB-J144"
          />
        }
      />
      <Route
        path="/Dashboard/Rombo2"
        element={
          <RomboDashboard
            name="Rombo 2"
            asset1="CMB-J141"
            asset2="CMB-J109"
            asset3="CMB-J145"
          />
        }
      />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/" element={<Main />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
