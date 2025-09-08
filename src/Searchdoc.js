import React from 'react'

const Searchdoc = ({doctname,setDoctname}) => {
  
    
  return (
    <div className="search">
      <label> Search</label>
    <input
     
     type="text"
     placeholder="Search Doctor's"
     value={doctname}
     onChange={(e)=> setDoctname(e.target.value)}
     max={new Date()}
    />
    </div>
  )
}

export default Searchdoc