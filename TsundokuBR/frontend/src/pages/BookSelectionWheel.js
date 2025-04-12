import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/Body.css';
import '../components/NavButtons.css';
import '../components/Button.css';
import '../components/Titles.css';
import '../components/Options.css';
import '../components/LevelInfo.css';

// The BookSelectionWheel component renders a spinning wheel to help users select books from their TBR (To Be Read) shelf.
function BookSelectionWheel() {
  // State to toggle the display of the info box
  const [showInfo, setShowInfo] = useState(false);

  // Reference to the canvas element for drawing the wheel
  const canvasRef = useRef(null);

  // State to track whether the wheel is currently spinning
  const [spinning, setSpinning] = useState(false);

  // State to store the selected book after the wheel stops spinning
  const [selectedBook, setSelectedBook] = useState(null);

  // State to dynamically change the button color based on the selected sector
  const [buttonColor, setButtonColor] = useState('#E9D7C0');

  // Array of book selection criteria to display on the wheel
  const books = [
    'at random with shut eyes',
    'in your favourite colour',
    'with a cover you love',
    'that are fiction',
    'that are non-fiction',
    'in a happy genre',
    'in a sad genre',
    'in a genre you love',
    'in a mysterious genre',
    'in a fantasy genre',
    'that are a series',
    'that are a standalone',
  ];

  // Array of muted colors to alternate between for the wheel sectors
  const mutedColors = ['#997864', '#7A6856'];

  // Map each book to a sector with a label and a color
  const sectors = books.map((label, index) => ({
    color: mutedColors[index % mutedColors.length], // Alternate colors
    label, // Book selection criteria
  }));

  // Total number of sectors on the wheel
  const totalSectors = sectors.length;

  // Angle of each sector in radians
  const arc = (2 * Math.PI) / totalSectors;

  // Friction factor to gradually slow down the spinning wheel
  const friction = 0.991;

  // Utility function to generate a random number between min and max
  const rand = (min, max) => Math.random() * (max - min) + min;

  // useEffect to handle the drawing and spinning of the wheel
  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas element
    const ctx = canvas.getContext('2d'); // Get the 2D drawing context
    const dia = canvas.width; // Diameter of the wheel
    const rad = dia / 2; // Radius of the wheel

    // Function to draw each sector of the wheel
    function drawSector(sector, i) {
      const ang = arc * i; // Starting angle of the sector
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = sector.color; // Set the sector color
      ctx.moveTo(rad, rad); // Move to the center of the wheel
      ctx.arc(rad, rad, rad, ang, ang + arc); // Draw the arc for the sector
      ctx.lineTo(rad, rad); // Close the path
      ctx.fill(); // Fill the sector with color
      ctx.translate(rad, rad); // Translate to the center
      ctx.rotate(ang + arc / 2); // Rotate to position the text
      ctx.font = 'bold 14px Verdana'; // Set font for the text
      ctx.fillStyle = '#E9D7C0'; // Set text color
      ctx.textAlign = 'left'; // Align text to the left
      ctx.fillText(sector.label, rad - 230, 10); // Draw the label
      ctx.restore();
    }

    // Function to rotate the wheel visually
    function rotateWheel(angle) {
      ctx.canvas.style.transform = `rotate(${angle - Math.PI / 2}rad)`; // Rotate the canvas
    }

    // Function to handle the spinning animation
    function spinWheel() {
      let rotation = 0; // Current rotation angle
      let angularVelocity = rand(0.25, 0.45); // Initial angular velocity

      // Recursive animation function
      function animate() {
        if (angularVelocity > 0.002) {
          rotation += angularVelocity; // Increment rotation
          angularVelocity *= friction; // Apply friction to slow down
          rotateWheel(rotation); // Rotate the wheel
          requestAnimationFrame(animate); // Continue animation
        } else {
          // Calculate the selected sector based on the final angle
          const normalizedAngle = (rotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
          const selectedSectorIndex = Math.floor(
            (totalSectors - (normalizedAngle / (2 * Math.PI)) * totalSectors) % totalSectors
          );

          // Set the selected book and button color
          if (sectors[selectedSectorIndex]) {
            setSelectedBook(books[selectedSectorIndex]);
            setButtonColor(sectors[selectedSectorIndex].color);
          }

          setSpinning(false); // Mark the wheel as not spinning
        }
      }

      animate(); // Start the animation
    }

    // Draw all sectors of the wheel
    sectors.forEach(drawSector);

    // Add event listener to the spin button
    const spinEl = document.querySelector('#spin');
    spinEl.addEventListener('click', () => {
      if (!spinning) {
        setSpinning(true); // Mark the wheel as spinning
        setButtonColor('#E9D7C0'); // Reset button color
        spinWheel(); // Start spinning the wheel
      }
    });

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      spinEl.removeEventListener('click', spinWheel);
    };
  }, [sectors, spinning]); // Dependencies: sectors and spinning state

  return (
    <div className="titles">
      {/* Header section */}
      <div className="titleandimage">
        <h1>TsundokuBR</h1>
        <div className="logo"></div>
      </div>

      {/* Page title */}
      <h2>Book Selection Wheel</h2>

      {/* Info section */}
      <h3 className="level-header">
        <span>Spin the wheel to help you select books from your physical TBR shelf!</span>
        <button
          className="info-button"
          onClick={() => setShowInfo(!showInfo)} // Toggle info box
          aria-label="More information"
        >
          ?
        </button>
      </h3>
      {showInfo && (
        <div className="info-box">
          <p>
            Selecting spin will help you allocate a method of selecting a book from your physical TBR shelf.
          </p>
        </div>
      )}

      {/* Wheel container */}
      <div className="wheel-container">
        <canvas ref={canvasRef} id="wheel" width="600" height="600" />
        <div
          id="spin"
          className="button"
          style={{
            backgroundColor: buttonColor, // Dynamic button color
          }}
        >
          {spinning ? 'SPINNING' : 'SPIN'} {/* Button text changes while spinning */}
        </div>
      </div>

      {/* Display the selected book */}
      {selectedBook && <p className="popup">Select your TBR books by picking books {selectedBook}</p>}

      {/* Navigation buttons */}
      <div className="navbar">
        <Link to="/booksetup" className="nav-button">
          My Book Setup
        </Link>
        <Link to="/dashboard" className="button">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default BookSelectionWheel;