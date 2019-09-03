import React from 'react'

const InputField = ({searchChange, enterPress}) => {
    return (
            <input onChange={searchChange} className="searchBar" onKeyPress={enterPress} placeholder="Search..."></input>
    )
}

export default InputField;