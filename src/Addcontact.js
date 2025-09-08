import React from 'react'

const Addcontact = ({docname,setDocname,lastMet,setLastMet,adddoclist,locationn,setLocationn}) => {

    
  return (
    <>
    <form className="content" onSubmit={adddoclist}  >
    <input 
        className="data"
        type="text"
        placeholder="Doctor's name"
        value={docname}
        onChange={(e)=>setDocname(e.target.value)}
        required
    />
    

    
    <select className="data" value={locationn} onChange={(e)=>setLocationn(e.target.value)} required>
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
        onChange={(e)=>setLastMet(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        required
    />
    <button className="data" type="submit">ADD</button>
    </form>
    </>
  )
}

export default Addcontact