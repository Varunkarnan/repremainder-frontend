import React, { useState } from 'react';
import './Filterdays.css';

const FilterDays =  ({ dayFilter, setDayFilter }) => {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    console.log('Selected filter:', dayFilter);
    setOpen(false);
  };

  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <div className="filterdays-button" onClick={() => setOpen(!open)}>
        Missed Calls
      </div>

      {open && (
        <div className="filterdays-popup">
          <label className="filter-label">Select days</label>
          <select
            className="filter-select"
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <option value="">Select days</option>
            <option value="Morethan10days">More than 10 days</option>
            <option value="Morethan20days">More than 20 days</option>
            <option value="Morethan30days">More than 30 days</option>
          </select>
          <button className="apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </>
  );
};

export default FilterDays;
