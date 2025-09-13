import React, { useState, useRef, useEffect } from "react";
import './Filterloc.css';

const FilterLoc = ({ filterLocation, handlefilter, uniqlocation, clearfilter }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter locations based on search term
  const filteredLocations = uniqlocation.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    setDropdownOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      {dropdownOpen && <div className="overlay" onClick={() => setDropdownOpen(false)}></div>}

      <div className="filterloc-wrapper" ref={dropdownRef}>
        <div className="filterloc-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {"Filter Location"}
        </div>

        {dropdownOpen && (
          <div className="filterloc-popup">
            <input
              type="text"
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filterloc-search"
            />
            <div className="filterloc-checkboxes">
              {filteredLocations.map((loc) => (
                <label key={loc}>
                  <input
                    type="checkbox"
                    value={loc}
                    onChange={handlefilter}
                    checked={filterLocation.includes(loc)}
                  />
                  {loc}
                </label>
              ))}
            </div>
            <div className="filterloc-actions">
              <button className="apply-btn" onClick={handleApply}>Apply</button>
              <button className="clear-btn" onClick={clearfilter}>Clear</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterLoc;
