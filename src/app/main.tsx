import { createRoot } from "react-dom/client";
import { appTree } from "./app";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("index.html has no #root element.");

createRoot(rootElement).render(appTree(import.meta.env.VITE_CONVEX_URL as string | undefined));
