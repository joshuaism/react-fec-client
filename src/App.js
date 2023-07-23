import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Header from "./components/Header";
import "./App.css";
import ContributionSearch from "./components/ContributionSearch";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<ContributionSearch />} />
        <Route path="/react-fec-client" element={<ContributionSearch />} />
        <Route path="/about" element={<About />} />
        <Route path="/react-fec-client/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
