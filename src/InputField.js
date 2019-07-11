import React from 'react'

const InputField = ({searchChange, enterPress}) => {
    return (
        <div>
            <input onChange={searchChange} className="searchBar roundsearchbar" onKeyPress={enterPress} placeholder="Enter your stocks here!"/>
        </div>
    )
}

export default InputField;