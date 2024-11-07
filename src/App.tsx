import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import Router from "./routes/Router";
import TopBar from "./components/topbar/Topbar";
import { useState } from "react";

function App() {
  const [is404Page, setIs404Page] = useState<boolean>(false);
  return (
    <BrowserRouter>
      <div className="app-layout !bg-background">
        <TopBar />
        <Header />
        <main className="app-content mt-6">
          <Router setIs404Page={setIs404Page} />
        </main>
        {is404Page && <Footer />}
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
