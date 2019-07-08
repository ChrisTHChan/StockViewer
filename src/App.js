import React, {Component} from 'react';
import './App.css';
import InputField from './InputField';
import StockInformation from './StockInformation'
import loading from './loading.gif'

//split bottom screen into 2 vertical halves (html/css) CHECK
//the left side will be your portfolio. CHECK
//add input field when you retrieve a stock from the stock list to add notes about the stock when its added to portfolio. CHECK
//add button when you retrieve a stock from the stock list to add it to your portfolio. CHECK 
//add functionality to buttons, wipe text from text fields when button is clicked. CHECK
//add a method to allow you to search through your portfolio for various stocks that you want to see.
//perhaps add a textfield that allows you to choose how many of one stock you want to add, and the total price, show percentage of portfolio that is made up from that stock.

class App extends Component {
  constructor() {
    super()
    this.state = {
      apiLoading: false,
      showInfo: false,
      showStockList: false,
      badSearch: false,
      apiPromiseRejection: false,
      stockList: [],
      statistics: [],
      input: '',
      notesInput: '',
      userStockSelection: '',
      symbol: '',
      currentPrice: '',
      nominalChange: '',
      percentChange: '',
      dailyOpen: '',
      dailyClose:'',
      dailyHigh: '',
      dailyLow: '',
      stockVolume: '',
      portfolioList: []
    }
  }

  onSearchChange = (e) => {
    this.setState({input: e.target.value.toUpperCase()})
  }

  onNotesChange = (e) => {
    this.setState({notesInput: e.target.value})
  }

  onAppendStock = () => {
    document.querySelector('.notesinput').value = ''
    const list = this.state.portfolioList
    list.push(`${this.state.statistics['01. symbol']} (${this.state.notesInput})`)
    this.setState({portfolioList: list})
    this.setState({showInfo: false})
  }

  showBadSearchMessage = () => {
    this.setState({badSearch: true})
  }

  unmountStockList = () => {
    this.setState({showStockList: false})
  }

  onEnterPress = (e) => {
    if (e.which === 13) {
      this.getStocksFunction()
    }
  }
  onPressEnterNotesChange = (e) => {
    if (e.which === 13) {
      this.onAppendStock()
    }
  }

  getStocksFunction = () => {
    document.querySelector('.searchBar').value = ''
    this.setState({showInfo: false})
    this.setState({apiPromiseRejection: false})
    if (this.state.input === '') {
      this.showBadSearchMessage()
      this.unmountStockList()
    } else {
      this.setState({apiLoading: true})
      this.setState({badSearch: false})
      this.unmountStockList()
      fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.state.input}&apikey=0TNNIAKWYZEM67YS`)
      .then(response => response.json())
      .then(stocks => this.setState({stockList: stocks['bestMatches']}, () => {
        if (this.state.stockList.length === 0) {
          this.showBadSearchMessage()
          this.setState({apiLoading: false})
        } else {
          this.setState({showStockList: true})
          this.setState({apiLoading: false})
        }
      }))
      .catch((error) => {
        this.setState({apiPromiseRejection: true})
        console.log(error)
      })
    }
  }

  getInfoFunction = (e) => {
    this.unmountStockList()
    this.setState({apiLoading: true})
    this.setState({userStockSelection: this.state.stockList[e.target.id]['1. symbol']}, () => {
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.state.userStockSelection}&apikey=0TNNIAKWYZEM67YS`)
      .then(response => response.json())
      .then(info => this.setState({statistics: info['Global Quote']}, () => {
        this.setState({apiLoading: false})
        this.setState({badSearch: false})
        this.setState({symbol: this.state.statistics['01. symbol']})
        this.setState({currentPrice: this.state.statistics['05. price']})
        this.setState({nominalChange: this.state.statistics['09. change']})
        this.setState({percentChange: this.state.statistics['10. change percent']})
        this.setState({dailyOpen: this.state.statistics['02. open']})
        this.setState({dailyClose: this.state.statistics['08. previous close']})
        this.setState({dailyHigh: this.state.statistics['03. high']})
        this.setState({dailyLow: this.state.statistics['04. low']})
        this.setState({stockVolume: this.state.statistics['06. volume']})
        this.setState({showInfo: true})
      }))
      .catch((error) => {
        this.setState({apiPromiseRejection: true})
        console.log(error)
      })
    })
  }

  render() {
    if (this.state.apiPromiseRejection === false) {
      return (
        <div className="App">
          <h1>Welcome to StockViewer</h1>
          <h2>Search for stocks and put them into your portfolio!</h2>
          <div className="center">
            <InputField searchChange={this.onSearchChange} enterPress={this.onEnterPress}/>
            <button onClick={this.getStocksFunction}>Search!</button>
          </div><br/>
          <div className='twoscreencontainer'>
            <div className='portfolio'>
              <h1>Portfolio:</h1>
              <div>
                {this.state.portfolioList.map((stock, i) => {
                  return <p key={i}>{`${i + 1}. `}{stock}</p>
                })}
              </div>
            </div>
            <div className='info'>
              <h1 style={{display: this.state.badSearch === true ? 'block' : 'none'}}>No Results Found.</h1>
              <img src={loading} alt='' className="loading" style={{display: this.state.apiLoading === true ? 'block' : 'none'}}/>
              <div style={{display: this.state.showStockList === true ? 'block' : 'none'}}>
                {this.state.stockList.map((stock, i) => {
                  return <h3 onClick={this.getInfoFunction} id={i} key={i}>{stock['1. symbol']}: {stock['2. name']}</h3>
                })}
              </div>
              <StockInformation 
                        symbol={this.state.symbol}
                        currentPrice={this.state.currentPrice}
                        nominalChange={this.state.nominalChange}
                        percentChange={this.state.percentChange} 
                        dailyOpen={this.state.dailyOpen}
                        dailyClose={this.state.dailyClose}
                        dailyHigh={this.state.dailyHigh}
                        dailyLow={this.state.dailyLow}
                        stockVolume={this.state.stockVolume}
                        show={this.state.showInfo}
                        error={this.state.badSearch}
                        notesChange={this.onNotesChange}
                        pressEnterNotesChange={this.onPressEnterNotesChange}
                        appendStock={this.onAppendStock}/>
            </div>
          </div>
        </div>
      )
    } else if (this.state.apiPromiseRejection === true) {
      return (
        <div className="App">
          <h1>Welcome to StockViewer</h1>
          <h2>Search for stocks and put them into your portfolio!</h2>
          <div className="center">
            <InputField searchChange={this.onSearchChange} enterPress={this.onEnterPress}/>
            <button onClick={this.getStocksFunction}>Search!</button>
          </div><br/>
          <div className='twoscreencontainer'>
            <div className='portfolio'>
              <h1>Portfolio:</h1>
            </div>
            <div className='info'>
              <h1>Failed to retrieve data! Check your internet, or try again later!</h1>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default App;
