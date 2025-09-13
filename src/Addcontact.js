import React, { useState } from "react";

const Addcontact = ({ docname, setDocname, lastMet, setLastMet, adddoclist, locationn, setLocationn }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <div className={`add-box ${open ? "open" : ""}`}>
        {!open ? (
          <h3 className="add-title" onClick={() => setOpen(true)}>+ Add Doctor</h3>
        ) : (
          <form className="add-form" onSubmit={adddoclist}>
            <span className="close-btn" onClick={() => setOpen(false)}>×</span>
            <h3>Add Doctor</h3>

            <input
              className="data"
              type="text"
              placeholder="Doctor's name"
              value={docname}
              onChange={(e) => setDocname(e.target.value)}
              required
            />

            <select
              className="data"
              value={locationn}
              onChange={(e) => setLocationn(e.target.value)}
              required
            >
              <option value="">Select Location</option>
              <option value="salem">Salem</option>
              <option value="attur">Attur</option>
              <option value="namakkal">Namakkal</option>
              <option value="yercaud">Yercaud</option>
              <option value="edappady">Edappady</option>
              <option value="omalur">Omalur</option>
              <option value="mettur">Mettur</option>
              <option value="dharmapuri">Dharmapuri</option>
              <option value="krishnagiri">Krishnagiri</option>
              <option value="hosur">Hosur</option>
              <option value="rasipuram">Rasipuram</option>
            </select>

            <input
              className="data"
              type="date"
              placeholder="Last Met"
              value={lastMet}
              onChange={(e) => setLastMet(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />

            <button className="submit-btn" type="submit">
              Save Doctor
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Addcontact;
