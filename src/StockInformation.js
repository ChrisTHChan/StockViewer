import React from 'react';

const StockInformation = (props) => {
        return (
            <div style={{display: props.show === true ? 'block' : 'none'}}>
                <div className="stockinfodiv">
                    <p className="stocksymbol"><strong>Stock Ticker:</strong> {props.symbol}</p>
                    <p><strong>Current Price:</strong> {props.currentPrice}</p>
                    <p><strong>Last Day's Close:</strong> {props.dailyClose}</p>
                    <p><strong>Nominal Change:</strong> {props.nominalChange}</p>
                    <p><strong>Percent Change:</strong> {props.percentChange}</p>
                    <p><strong>Today's Open:</strong> {props.dailyOpen}</p>
                    <p><strong>Today's High:</strong> {props.dailyHigh}</p>
                    <p><strong>Today's Low:</strong> {props.dailyLow}</p>
                    <p><strong>Stock Volume:</strong> {props.stockVolume}</p>
                </div>
                <h5>Notes:<input placeholder='Enter any notes here' className='notesinput' onChange={props.notesChange}></input></h5>
                <h5>How many shares you would like:<input type="number" className="add_value" placeholder="Value" onChange={props.numberOfSharesChange} onKeyPress={props.enterPressShares}></input></h5>
                <button onClick={props.appendStock}>Submit to Portfolio!</button>
            </div>
        )
}

export default StockInformation;