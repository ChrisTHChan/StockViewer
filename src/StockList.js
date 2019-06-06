import React from 'react'

const StockList = (props) => {
    return (
        <div>
            {props.listOfStocks.map((stock) => {
              return <h3>{stock['1. symbol']}: {stock['2. name']}</h3>
            })}
        </div>
    )
}

export default StockList;