import React, {Component} from 'react';
import './App.css';
import InputField from './InputField';
import StockInformation from './StockInformation'
import loading from './loading.gif'

//maybe work on header being sticky? see if it looks good?
//Add click functionality to the left side portfolio div's so you can click them to retrieve the stocks info.
//Add delete button to remove stocks from your portfolio.
//Add a footer that describes your email, personal contact info, can download your resume (maybe? dunno how to do that.)

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
      sharesInput: '',
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
      portfolioList: [],
      filteredPortfolioList: [],
      portfolioValue: 0,
    }
  }

  onAppendStock = () => {
    document.querySelector('.notesinput').value = ''
    document.querySelector('.add_value').value = ''
    document.querySelector('.filterinput').value = ''
    const list = this.state.portfolioList
    list.push([`${this.state.statistics['01. symbol']}`, `No. of Shares: ${this.state.sharesInput}`, `Total Value of Shares: $${Math.floor((this.state.sharesInput * this.state.statistics['05. price']) * 100) / 100}`, `Notes: ${this.state.notesInput}`])
    this.setState({portfolioList: list}, () => {
      this.setState({filteredPortfolioList: this.state.portfolioList})
    })
    this.setState({showInfo: false})
    this.setState({portfolioValue: Math.floor((this.state.portfolioValue + (this.state.sharesInput * this.state.statistics['05. price'])) * 100) / 100})
  }

  onFilterPortfolio = (e) => {
    if (e.target.value === '') {
      this.setState({filteredPortfolioList: this.state.portfolioList})
    } else {
      this.setState({filteredPortfolioList: this.state.portfolioList.filter(stock => {
        return stock[0].includes(e.target.value.toUpperCase())
      })})
    }
  }

  onDeletePortfolioItem = (e) => {
    const unfilteredList = this.state.portfolioList
    const filteredList = this.state.filteredPortfolioList
    const iD = e.target.parentNode.parentNode.id
    filteredList.splice(iD, 1)
    this.setState({filteredPortfolioList: filteredList})
  }

  onSearchChange = (e) => {
    this.setState({input: e.target.value.toUpperCase()})
  }

  onNotesChange = (e) => {
    this.setState({notesInput: e.target.value})
  }
  
  onNumberOfSharesChange = (e) => {
    this.setState({sharesInput: parseInt(e.target.value)})
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

  onEnterPressShares = (e) => {
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
          <div className="header">
            <h2 className="title">StockViewer</h2>
            <h4 className="subtitle">Search for stocks and put them into your portfolio!</h4>
          </div>
          <div className="center">
            <div className="searchcontainer">
              <InputField searchChange={this.onSearchChange} enterPress={this.onEnterPress}/>
              <button className='searchButton' onClick={this.getStocksFunction}>Search!</button>
            </div>
          </div><br/>
          <div className='twoscreencontainer'>
            <div className='info'>
              <div className="infoheader">
                <p className="twoscreenheaders">Your Stock Search Results:</p>
                <input className="filterinputplaceholder placeholder roundsearchbar" placeholder="placeholder"></input>
              </div>
              <h1 style={{display: this.state.badSearch === true ? 'block' : 'none'}}>No Results Found.</h1>
              <img src={loading} alt='' className="loading" style={{display: this.state.apiLoading === true ? 'block' : 'none'}}/>
              <div style={{display: this.state.showStockList === true ? 'block' : 'none'}}>
                {this.state.stockList.map((stock, i) => {
                  return <p className="searchresults" onClick={this.getInfoFunction} id={i} key={i}>{stock['1. symbol']}: {stock['2. name']}</p>
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
                        enterPressShares={this.onEnterPressShares}
                        appendStock={this.onAppendStock}
                        numberOfSharesChange={this.onNumberOfSharesChange}/>
            </div>
            <div className='portfolio'>
              <div className="portfolioheader">
                <p className="twoscreenheaders">Portfolio Value: ${this.state.portfolioValue}</p>
                <input placeholder="Filter your portfolio!" className="filterinput roundsearchbar" onChange={this.onFilterPortfolio}></input>
              </div>
              <div>
                {this.state.filteredPortfolioList.map((stock, i) => {
                  return <div className="portfoliostockdiv" id={i} key={i}>
                    <div>
                      <p className="portfoliostockp">{stock[0]}</p>
                      <p className="portfoliostockp">{stock[1]}</p>
                      <p className="portfoliostockp">{stock[2]}</p>
                      <p className="portfoliostockp">{stock[3]}</p>
                    </div>
                    <div>
                      <button className="deletebutton" onClick={this.onDeletePortfolioItem}>X</button>
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>
        </div>
      )
    } else if (this.state.apiPromiseRejection === true) {
      return (
        <div className="App">
          <h1>Failed to retrieve data! Check your internet, or try again later!</h1>
        </div>
      )
    }
  }
}

export default App;
