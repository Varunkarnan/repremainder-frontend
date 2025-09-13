import React from 'react'
import './searchdoc.css'


const Searchdoc = ({ doctname, setDoctname }) => {
  return (
    <div className="premium-search-wrapper">
      <input
        type="text"
        placeholder="Search Doctor..."
        value={doctname}
        onChange={(e) => setDoctname(e.target.value)}
        className="premium-search"
      />
    </div>
  )
}

export default Searchdoc
