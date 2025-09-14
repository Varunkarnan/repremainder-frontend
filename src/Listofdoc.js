import React, { useState,useEffect} from 'react'
import './Listofdoc.css' 


const Listofdoc = ({doclist,setDoclist,daysremaining}) => {

  
  const[newMet,setNewmet]=useState({})
  const [months, setMonths] = useState([])
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  
  useEffect(() => {
  fetch(`${backendUrl}/doctors/months/`, { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      const formattedMonths = (data.months || []).map((m) => ({
        year: m.year,
        month: m.month,
        label: m.label, // already "July 2025", etc.
        url: `${backendUrl}${m.download_url}`, // ✅ use backend-provided URL
      }));
      setMonths(formattedMonths);
    })
    .catch((err) => console.error("Error fetching months:", err));
}, []);


      const handleSendEmail = async () => {
      setEmailLoading(true);
      setEmailMessage("");

      try {
        const response = await fetch(`${backendUrl}/send-doctors-email/`, {
          method: "GET", // Django view handles sending email
          credentials: "include",
        });

        // Optional: if your Django view returns JSON
        const data = await response.json();
        if (data.success) {
          setEmailMessage(data.message);
        } else {
          setEmailMessage("Failed: " + data.message);
        }
      } catch (error) {
        setEmailMessage("Error: " + error.message);
      } finally {
        setEmailLoading(false);
      }
      };


  const handleUpdate = (id) => {
  const selectdate = newMet[id]; // this is "YYYY-MM-DD"
  const today = new Date().toISOString().split("T")[0];

  if (!selectdate) {
    alert("Please select a date");
    return;
  }

  if (selectdate > today) {
    alert("You cannot select a future date");
    return;
  }

  // Convert YYYY-MM-DD → DD-MM-YYYY
  const [year, month, day] = selectdate.split("-");
  const ddmmyyyy = `${day}-${month}-${year}`;

  fetch(`${backendUrl}/api/doctors/${id}/update/`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lastMet: ddmmyyyy })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const updatedList = doclist.map(doc =>
          doc.id === id ? { ...doc, lastMet: data.lastMet } : doc
        );
        setDoclist(updatedList);
        setNewmet(prev => ({ ...prev, [id]: "" })); // clear only that input
      } else {
        alert(data.error || "Update failed");
      }
    })
    .catch(err => console.error("Update error:", err));
};

  const handleDlt = (id) => {
  const confirmdlt = window.confirm("Are you sure you want to delete this doctor?");
  if (confirmdlt) {
    fetch(`${backendUrl}/api/doctors/${id}/delete/`, {
      method: "DELETE",
      credentials:"include",
    })
      .then(res => {
        if (res.ok) {
          setDoclist(doclist.filter((doc) => doc.id !== id));
        } else {
          alert("Failed to delete doctor from database");
        }
      })
      .catch(err => console.error("Error deleting doctor:", err));
  }
};
const handleDownloadPdf = (year, month) => {
  window.open(`${backendUrl}/doctors/pdf/${year}/${month}/`, "_blank");
};


  
  return (
    <>
    <div className="table">
    <table className="tablee" >
        <thead>
            <tr>
                <th className='tc'>S.No</th>
                <th className="tc">Doc Name</th>
                <th className='tc'>Location</th>
                <th className="tc">Last Met</th>
                <th className="tc">Days Remaining</th>
                <th className='tc'>Days Passed</th>
                <th className="tc" >Update the date</th>
                <th className="tc">Update</th>
                <th className='tc'>DELETE</th>
                <th className='tc'>Download as PDF</th>

            </tr>
        </thead>
        <tbody>
          {doclist.map((doc,index)=>{
            const{dayspassed,daysremainingg}=daysremaining(doc.lastMet);
            return (
              
            <tr key={doc.id}>
              <td className="tc">{index+1}</td>
              <td className="tc">Dr.{doc.name}</td>
              <td className='tc'>{doc.location}</td>
              <td className="tc">
                {(() => {
                  if (!doc.lastMet) return "";
                  const [year, month, day] = doc.lastMet.split("-");
                  return `${day}-${month}-${year}`;
                })()}
              </td>
              <td className="tc">{daysremainingg} Days </td>
              <td className='tc'>{dayspassed} Days</td>
              <td className="tc">
                <input 
                  type="date"
                  value={newMet[doc.id]|| ""}
                  onChange={(e)=> setNewmet({...newMet,[doc.id]:e.target.value}) }
                  max={new Date().toISOString().split("T")[0]}
                  
                />
              </td>
              <td className='tc'>
                <button onClick={()=>handleUpdate(doc.id)}> Update</button>
              </td>
              <td className='tc'>
                <button onClick={()=> handleDlt(doc.id)}>DELETE</button>
              </td>
              <td className="tc">
                <button onClick={() => window.open(
                  `${backendUrl}/api/doctors/${doc.id}/download-history/`, "_blank")}>
                  Download PDF
                </button>
              </td>

          </tr>
          )})}
        </tbody>
    </table>
    </div>


  
  <div>
        <button
          className="pdf-action-btn"
          onClick={() =>
            window.open(
              `${backendUrl}/api/download/all-doctors/pdf/`,
              "_blank"
            )
          }
        >
          Download PDF
        </button>
      </div>


      
      <div className="my-4">
        <button 
          className="pdf-action-btn"
          onClick={handleSendEmail}
          disabled={emailLoading}
        >
          {emailLoading ? "Sending Email..." : "Send Doctors PDF to Email"}
        </button>
        {emailMessage && <p className="mt-2 text-sm text-gray-700">{emailMessage}</p>}
      </div>


      <div className="p-4">
        <h2 className="btn">Download Monthly Doctor Reports</h2>
        <div className="">
          {months.map((m) => (
            <button
              key={`${m.year}-${m.month}`}
              onClick={() => handleDownloadPdf(m.year, m.month)}
              className="month-button"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
  </>
  )
}

export default Listofdoc