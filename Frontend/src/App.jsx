import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (   // <-- add return here
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Schemes" element={<Schemes />} />
        <Route path="/Schemes/:id" element={<SchemeDetails />} />
        {/* Later we can add more routes like Schemes, FAQ, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
