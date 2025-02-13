import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // Import useDropzone
import "./AttendeeDetails.css";

export default function AttendeeDetails() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("attendeeDetails"));
    if (savedData) {
      setFullName(savedData.fullName);
      setEmail(savedData.email);
      setAvatarUrl(savedData.avatarUrl);
      setSpecialRequest(savedData.specialRequest || "");
    }
  }, []);

  // Drag-and-drop file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*", // Accept only image files
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageUpload(acceptedFiles[0]); // Upload the first file
      }
    },
  });

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    console.log("Selected File:", file); // Debugging
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image_upload");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbeu2wgqg/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Uploaded Image URL:", data.secure_url); // Debugging
      setAvatarUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const attendeeDetails = { fullName, email, avatarUrl, specialRequest };
      localStorage.setItem("attendeeDetails", JSON.stringify(attendeeDetails));
      navigate("/ticket-ready");
    }
  };

  return (
    <div className="container">
      <div className="details-box">
        <h2 className="title">Attendee Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Drag-and-drop file upload */}
          <div className="form-group">
            <label htmlFor="avatar">Upload Avatar</label>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {avatarUrl ? (
                <div className="avatar-preview">
                  <img src={avatarUrl} alt="Uploaded Avatar" className="avatar-image" />
                </div>
              ) : (
                <p> Drag & drop an image here, or click to select one</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-describedby="fullNameError"
            />
            {errors.fullName && (
              <span id="fullNameError" className="error">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="emailError"
            />
            {errors.email && (
              <span id="emailError" className="error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="specialRequest">Special Request</label>
            <textarea
              id="specialRequest"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              aria-describedby="specialRequestError"
            />
            {errors.specialRequest && (
              <span id="specialRequestError" className="error">
                {errors.specialRequest}
              </span>
            )}
          </div>

          <div className="button-group">
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              Back
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isUploading || !fullName || !email}
            >
              {isUploading ? "Uploading..." : "Get My Free Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}