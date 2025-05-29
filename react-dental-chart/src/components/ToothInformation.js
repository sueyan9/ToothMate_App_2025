import { useState } from "react";

export default function ToothInformation({ tooth }) {
const [isOpen, setIsOpen] = useState(false);
const onToggle = () => setIsOpen(!isOpen);
  
  return (
    <div className={`tooth-info ${isOpen ? 'open' : ''}`} onClick={onToggle}>
      <div>^ More Information</div>
      {isOpen && (
        <div>
          <h3>{tooth}</h3>
          <p>Information</p>
        </div>
      )}
    </div>
  );
}