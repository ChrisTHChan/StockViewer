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
                <pre className='pre'>Notes:  <input className='notesinput roundsearchbar' onChange={props.notesChange}></input></pre>
                <pre className='pre'>How many shares you would like:  <input type="number" placeholder="Enter a number!" className="add_value roundsearchbar" onChange={props.numberOfSharesChange} onKeyPress={props.enterPressShares}></input></pre>
                <button onClick={props.appendStock}>Submit to Portfolio!</button>
            </div>
        )
}

export default StockInformation;