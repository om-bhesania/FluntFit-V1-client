import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Router from "./routes/Router";
import { Login } from "./pages/auth/login";
import { AuthProvider } from "./routes/auth/AuthProvider";
import SessionProvider from "./services/SessionProvider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Router />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
