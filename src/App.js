import { useEffect, useState } from "react";
import Addcontact from "./Addcontact";
import Listofdoc from "./Listofdoc";
import Searchdoc from "./Searchdoc";
import Filterdays from "./Filterdays";
import Filterloc from "./Filterloc";
import "./App.css";

// Helper to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function App() {
  const [docname, setDocname] = useState("");
  const [lastMet, setLastMet] = useState("");
  const [doclist, setDoclist] = useState([]);
  const [locationn, setLocationn] = useState("");
  const [filterLocation, setfilterLocation] = useState([]);
  const [doctname, setDoctname] = useState("");
  const [dayFilter, setDayFilter] = useState("");

  const backendUrl = process.env.REACT_APP_API_URL;

  // Fetch all doctors on mount
  useEffect(() => {
    if (!backendUrl) {
      console.error("REACT_APP_API_URL is not defined!");
      return;
    }

    fetch(`https://repremainder-backend-production.up.railway.app/api/doctors/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched doctors:", data); // Debug API response
        // Handle paginated (results) or plain array
        const doctorArray = data.results ? data.results : data;
        const formatted = doctorArray.map((doc) => ({
          id: doc.id,
          name: doc.name,
          location: doc.location ? doc.location.toLowerCase() : "",
          lastMet: doc.lastMet,
        }));
        setDoclist(formatted);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [backendUrl]);

  // Add a new doctor
  const adddoclist = (e) => {
    e.preventDefault();
    if (!docname || !lastMet || !locationn) {
      alert("Please fill all fields!");
      return;
    }

    // Convert YYYY-MM-DD to DD-MM-YYYY
    const [year, month, day] = lastMet.split("-");
    const ddmmyyyy = `${day}-${month}-${year}`;

    fetch(`https://repremainder-backend-production.up.railway.app/api/doctors/`, {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ name: docname, lastMet: ddmmyyyy, location: locationn }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to add doctor: ${res.status}`);
        return res.json();
      })
      .then((newDoc) => {
        setDoclist([
          ...doclist,
          {
            id: newDoc.id,
            name: newDoc.name,
            location: newDoc.location ? newDoc.location.toLowerCase() : "",
            lastMet: newDoc.lastMet,
          },
        ]);
        setLocationn("");
        setDocname("");
        setLastMet("");
      })
      .catch((err) => console.error("Error adding doctor:", err));
  };

  // Filter and search logic
  const handlefilter = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      if (!filterLocation.includes(value)) setfilterLocation([...filterLocation, value]);
    } else {
      setfilterLocation(filterLocation.filter((loc) => loc !== value));
    }
  };

  const parseDDMMYYYY = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const daysremaining = (lastMet) => {
    const today = new Date();
    const lastMetDate = parseDDMMYYYY(lastMet);
    const diffTime = today - lastMetDate;
    const daysdonee = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaindays = 10 - daysdonee;
    return { daysremainingg: remaindays > 0 ? remaindays : 0, dayspassed: daysdonee };
  };

  const clearfilter = () => setfilterLocation([]);

  const searchhdoc = doclist
    .filter((doc) => doc.name.toLowerCase().includes(doctname.toLowerCase()))
    .filter((doc) => filterLocation.length === 0 || filterLocation.includes(doc.location))
    .filter((doc) => {
      const days = daysremaining(doc.lastMet);
      switch (dayFilter) {
        case "Morethan10days":
          return days.dayspassed > 10;
        case "Morethan20days":
          return days.dayspassed > 20;
        case "Morethan30days":
          return days.dayspassed > 30;
        default:
          return true;
      }
    });

  const uniqlocation = [...new Set(doclist.map((doc) => doc.location))];

  return (
    <>
      <div className="top-section">
        <Addcontact
          adddoclist={adddoclist}
          docname={docname}
          setDocname={setDocname}
          lastMet={lastMet}
          setLastMet={setLastMet}
          locationn={locationn}
          setLocationn={setLocationn}
        />

        <div className="top-right-filters">
          <Searchdoc doctname={doctname} setDoctname={setDoctname} />
          <Filterdays dayFilter={dayFilter} setDayFilter={setDayFilter} />
          <Filterloc
            filterLocation={filterLocation}
            setfilterLocation={setfilterLocation}
            uniqlocation={uniqlocation}
            handlefilter={handlefilter}
            clearfilter={clearfilter}
          />
        </div>
      </div>

      <div className="table-container">
        <Listofdoc doclist={searchhdoc} setDoclist={setDoclist} daysremaining={daysremaining} />
      </div>
    </>
  );
}

export default App;
