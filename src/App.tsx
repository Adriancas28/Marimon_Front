import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Catalogo from "./Pages/Catalogo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;