import { HeroUIProvider } from "@heroui/react";
import { NextUIProvider } from "@nextui-org/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
  </NextUIProvider>
);
