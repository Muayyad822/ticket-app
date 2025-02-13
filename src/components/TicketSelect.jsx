import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TicketSelect.css";

const ticketOptions = [
  { type: "Free", price: 0, label: "REGULAR ACCESS", available: 20 },
  { type: "VIP", price: 150, label: "VIP ACCESS", available: 20 },
  { type: "VVIP", price: 150, label: "VVIP ACCESS", available: 20 },
];

export default function TicketSelect() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleTicketSelect = (type) => {
    setSelectedTicket(type);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) ? 1 : value);
  };

  const handleNext = () => {
    if (selectedTicket) {
      localStorage.setItem("selectedTicket", selectedTicket);
      navigate("/attendee-details");
    } else {
      alert("Please select a ticket type.");
    }
  };  

  return (
    <div className="container">
      <div className="ticket-box">
        <h2 className="title">Ticket Selection</h2>
        <div className="event-info">
          <h3 className="event-name">Techember Fest '25</h3>
          <p className="event-description">Join us for an unforgettable experience.</p>
          <p className="event-details">📍 Event Location |📅 March 15, 2025 |🕕 7:00 PM</p>
        </div>

        <h3 className="section-title">Select Ticket Type:</h3>
        <div className="ticket-options">
          {ticketOptions.map((ticket) => (
            <button
              key={ticket.type}
              className={`ticket-option ${selectedTicket === ticket.type ? "selected" : ""}`}
              onClick={() => handleTicketSelect(ticket.type)}
            >
              <div className="ticket-info">
                <span>{ticket.type} {ticket.price > 0 ? `$${ticket.price}` : "(Free)"}</span>
                <span className="availability">{ticket.available}/52 left</span>
              </div>
            </button>
          ))}
        </div>

        <label className="section-title">Number of Tickets:</label>
        <select
          className="ticket-quantity"
          value={quantity}
          onChange={handleQuantityChange}
        >
          {[...Array(5).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>{num + 1}</option>
          ))}
        </select>

        <div className="button-group">
          <button className="cancel-button" type="button">Cancel</button>
          <button
            className={`next-button ${selectedTicket ? "active" : "disabled"}`}
            disabled={!selectedTicket}
            type="button"
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}