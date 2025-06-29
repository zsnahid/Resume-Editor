import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./app/home/Home";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Failed to find the root element. The element with id='root' could be missing from index.html",
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
