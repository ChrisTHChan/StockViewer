import React from 'react'

const InputField = ({searchChange, enterPress}) => {
    return (
        <div>
            <input onChange={searchChange} className="searchBar" onKeyPress={enterPress}/>
        </div>
    )
}

export default InputField;