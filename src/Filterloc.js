import React from 'react'

const Filterloc = ({filterLocation,handlefilter,uniqlocation,clearfilter}) => {
   
    
  return (
    <div className="content">
    <div className="filterbox">
      <h3>Filter by Location:</h3>
      {uniqlocation.map((loc)=>(
        <label key={loc}>
        <input
          type="checkbox"
          value={loc}
          onChange={handlefilter}
          checked={filterLocation.includes(loc)}
        />{loc}
      </label>
      
      )

      )}
      <button onClick={clearfilter}>Clear filter</button>
       
    </div> 
    </div>
    
    
  )
}


export default Filterloc