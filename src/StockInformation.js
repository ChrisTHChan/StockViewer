import React from 'react';

const StockInformation = (props) => {
        return (
            <div style={{display: props.show === true ? 'block' : 'none'}}>
                <h4>Stock Symbol: {props.symbol}</h4>
                <h4>Current Price: {props.currentPrice}</h4>
                <h4>Last Day's Close: {props.dailyClose}</h4>
                <h4>Nominal Change: {props.nominalChange}</h4>
                <h4>Percent Change: {props.percentChange}</h4>
                <h4>Today's Open: {props.dailyOpen}</h4>
                <h4>Today's High: {props.dailyHigh}</h4>
                <h4>Today's Low: {props.dailyLow}</h4>
                <h4>Stock Volume: {props.stockVolume}</h4>
                <h5>Notes:<input placeholder='Enter any notes here' className='notesinput' onChange={props.notesChange} onKeyPress={props.pressEnterNotesChange}></input></h5>
                <button onClick={props.appendStock}>Submit to Portfolio!</button>
            </div>
        )
}

export default StockInformation;