import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import Router from "./routes/Router";
import TopBar from "./components/topbar/Topbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <TopBar />
        <Header />
        <main className="app-content mt-6">
          <Router />
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
