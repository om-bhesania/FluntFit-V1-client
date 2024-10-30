import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import Router from "./routes/Router";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <main className="app-content min-h-[calc(100dvh-367px)] mt-6">
          <Router />
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
