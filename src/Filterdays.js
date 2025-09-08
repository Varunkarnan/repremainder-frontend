import React from 'react'

const Filterdays = ({dayFilter,setDayFilter}) => {
  return (
    <div className="content">
    <div className="filterbox">
        <label className="titles"> Missed calls</label>
        <select value={dayFilter} onChange={(e)=> setDayFilter(e.target.value)}>
            
            <option value="">select days</option>
            <option value="Morethan10days">More than 10 days</option>
            <option value="Morethan20days">More than 20 days</option>
            <option value="Morethan30days">More than 30 days</option>
        </select>
    </div>
    </div>
    
    
  )
}

export default Filterdays