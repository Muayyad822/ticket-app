import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SelectTicket from "./components/TicketSelect";
import AttendeeDetails from "./components/AttendeeDetails";
import TicketReady from "./components/TicketReady";
import Header from "./assets/Header.png"
import "./App.css"

function App() {
  return (
    
    <Router>
      <img src={Header} alt="Header" className="Header"/>
      <Routes>
        <Route path="/" element={<SelectTicket />} />
        <Route path="/attendee-details" element={<AttendeeDetails />} />
        <Route path="/ticket-ready" element={<TicketReady />} />
      </Routes>
    </Router>
  );
}

export default App;