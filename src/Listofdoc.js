import React, { useState, useEffect } from "react";
import "./Listofdoc.css";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    document.cookie.split(";").forEach((cookie) => {
      const c = cookie.trim();
      if (c.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(c.substring(name.length + 1));
      }
    });
  }
  return cookieValue;
}

const Listofdoc = ({ doclist, setDoclist, daysremaining, backendUrl }) => {
  const [newMet, setNewmet] = useState({});
  const [months, setMonths] = useState([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    if (!backendUrl) return;

    fetch(`${backendUrl}/doctors/months/`, { credentials: "include" })
      .then((res) =>{
        res.json()
        console.log(res)
      }) 
      
      .then((data) => {
        console.log(data)
        const formattedMonths = (data.months || []).map((m) => ({
          year: m.year,
          month: m.month,
          label: m.label,
        
        }));
        setMonths(formattedMonths);
      })
      .catch((err) => console.error("Error fetching months:", err));
  }, [backendUrl]);

  const handleSendEmail = async () => {
    setEmailLoading(true);
    setEmailMessage("");
    try {
      const res = await fetch(`${backendUrl}/send-doctors-email/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setEmailMessage(data.success ? data.message : "Failed: " + data.message);
    } catch (err) {
      setEmailMessage("Error: " + err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdate = (id) => {
    const selectdate = newMet[id];
    if (!selectdate) return alert("Please select a date");
    const today = new Date().toISOString().split("T")[0];
    if (selectdate > today) return alert("Cannot select future date");

    const [year, month, day] = selectdate.split("-");
    const ddmmyyyy = `${day}-${month}-${year}`;

    fetch(`${backendUrl}/api/doctors/${id}/update/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ lastMet: ddmmyyyy }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDoclist(doclist.map((doc) => (doc.id === id ? { ...doc, lastMet: data.lastMet } : doc)));
          setNewmet((prev) => ({ ...prev, [id]: "" }));
        } else alert(data.error || "Update failed");
      })
      .catch((err) => console.error("Update error:", err));
  };

  const handleDlt = (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    fetch(`${backendUrl}/api/doctors/${id}/delete/`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-CSRFToken": getCookie("csrftoken") },
    })
      .then((res) => {
        if (res.ok) setDoclist(doclist.filter((doc) => doc.id !== id));
        else alert("Failed to delete doctor");
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const handleDownloadPdf = (year, month) => {
    window.open(`${backendUrl}/doctors/pdf/${year}/${month}/`, "_blank");
  };

  return (
    <>
      <div className="table">
        <table className="tablee">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Doc Name</th>
              <th>Location</th>
              <th>Last Met</th>
              <th>Days Remaining</th>
              <th>Days Passed</th>
              <th>Update the date</th>
              <th>Update</th>
              <th>DELETE</th>
              <th>Download PDF</th>
            </tr>
          </thead>
          <tbody>
            {doclist.map((doc, index) => {
              const { dayspassed, daysremainingg } = daysremaining(doc.lastMet);
              return (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>Dr.{doc.name}</td>
                  <td>{doc.location}</td>
                  <td>{doc.lastMet}</td>
                  <td>{daysremainingg} Days</td>
                  <td>{dayspassed} Days</td>
                  <td>
                    <input
                      type="date"
                      value={newMet[doc.id] || ""}
                      onChange={(e) => setNewmet({ ...newMet, [doc.id]: e.target.value })}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(doc.id)}>Update</button>
                  </td>
                  <td>
                    <button onClick={() => handleDlt(doc.id)}>DELETE</button>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        window.open(`${backendUrl}/api/doctors/${doc.id}/download-history/`, "_blank")
                      }
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="my-4">
        <button className="pdf-action-btn" onClick={handleSendEmail} disabled={emailLoading}>
          {emailLoading ? "Sending Email..." : "Send Doctors PDF to Email"}
        </button>
        {emailMessage && <p>{emailMessage}</p>}
      </div>

      <div className="p-4">
        <h2>Download Monthly Doctor Reports</h2>
        {months.map((m) => (
          <button key={`${m.year}-${m.month}`} onClick={() => handleDownloadPdf(m.year, m.month)}>
            {m.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default Listofdoc;
