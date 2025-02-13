import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import "./TicketReady.css";
import barcodeImage from "./barcode.png";

export default function TicketReady() {
  const [ticketDetails, setTicketDetails] = useState(null);
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("attendeeDetails"));
    const ticketType = localStorage.getItem("selectedTicket");

    if (savedDetails && ticketType) {
      setTicketDetails({ ...savedDetails, ticketType });
    } else {
      alert("No ticket details found. Please start over.");
      navigate("/");
    }
  }, [navigate]);

  const handleDownload = async () => {
    if (ticketRef.current) {
      const canvas = await html2canvas(ticketRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `TechemberFest_Ticket_${ticketDetails?.fullName}.png`;
      link.click();
    }
  };

  const handleBookAnother = () => {
    navigate("/");
  };

  if (!ticketDetails) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="ticket-box" ref={ticketRef}>
        <h2 className="title">MY TICKETS</h2>
        <div className="ticket-content">
          <h3 className="event-name">Techember Fest '25</h3>
          <p className="event-details">📍 Event Location |📅 March 15, 2025 |🕕 7:50 PM</p>

          <div className="attendee-info">
            <p><strong>Name:</strong> {ticketDetails.fullName}</p>
            <p><strong>Email:</strong> {ticketDetails.email}</p>
            <p><strong>Ticket Type:</strong> {ticketDetails.ticketType}</p>
            <p><strong>Special Request:</strong> {ticketDetails.specialRequest || "None"}</p>

            {ticketDetails.avatarUrl && (
              <div className="avatar-section">
                <img src={ticketDetails.avatarUrl} alt="Avatar" className="avatar-image" />
              </div>
            )}
          </div>

          <div className="barcode">
            <img src={barcodeImage} alt="Barcode" />
          </div>
        </div>
      </div>

      <div className="button-group">
        <button className="book-another-button" type="button" onClick={handleBookAnother}>
          Book Another Ticket
        </button>
        <button className="download-button" type="button" onClick={handleDownload}>
          Download Ticket
        </button>
      </div>
    </div>
  );
}
