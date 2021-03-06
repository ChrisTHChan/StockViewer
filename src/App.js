import React, {Component} from 'react';
import './stylesheets/App.css';
import InputField from './components/InputField';
import StockInformation from './components/StockInformation'
import loading from './assets/loading.gif'
import scrolldown from './assets/scrolldown.svg'

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
      searchInput: '',
      previousSearchInput: '',
      notesInput: '',
      sharesInput: '',
      filterInput: '',
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
      stockValuesList: [],
      filteredPortfolioList: [],
      portfolioValue: 0,
    }
  }

  hideScrollDownIcon = () => {
    document.querySelector('.scrolldownicon').style.display = 'none'
  }

  showScrollDownIcon = () => {
    //create if statement here saying only do this if the content overflows the div (not sure how to do that?)
    document.querySelector('.scrolldownicon').style.display = 'inline-block'
  }
  
  onHandleScroll = (e) => {
    const floor = Math.floor(e.target.offsetHeight + e.target.scrollTop) === e.target.scrollHeight
    const ceil = Math.ceil(e.target.offsetHeight + e.target.scrollTop) === e.target.scrollHeight
    if (floor || ceil) {
      this.hideScrollDownIcon()
    } else {
      this.showScrollDownIcon()
    }
  }

  onAppendStock = () => {
    const list = this.state.portfolioList
    list.push([`${this.state.statistics['01. symbol']}`, `No. of Shares: ${this.state.sharesInput}`, `Total Value of Shares: $${Math.floor((this.state.sharesInput * this.state.statistics['05. price']) * 100) / 100}`, `Notes: ${this.state.notesInput}`])
    this.setState({portfolioList: list}, () => {
      this.setState({filteredPortfolioList: this.state.portfolioList})
    })
    const valuesList = this.state.stockValuesList
    valuesList.push(Math.floor((this.state.sharesInput * this.state.statistics['05. price']) * 100) / 100)
    this.setState({stockValuesList: valuesList})
    this.setState({portfolioValue: Math.floor((this.state.portfolioValue + (this.state.sharesInput * this.state.statistics['05. price'])) * 100) / 100})
    document.querySelector('.notesinput').value = ''
    document.querySelector('.add_value').value = ''
    document.querySelector('.filterinput').value = ''
    this.setState({notesInput: ''})
    this.setState({sharesInput: ''})
    this.setState({filterInput: ''})
    this.hideScrollDownIcon()
    this.setState({showInfo: false})
  }

  onFilterPortfolio = (e) => {
    this.setState({filterInput: e.target.value}, () => {
      if (this.state.filterInput === '') { 
        this.setState({filteredPortfolioList: this.state.portfolioList})
      } else {
        this.setState({filteredPortfolioList: this.state.portfolioList.filter(stock => {
          return stock[0].includes(this.state.filterInput.toUpperCase())
        })})
      }
    })
  }

  onDeletePortfolioItem = (e) => {
    const unfilteredList = this.state.portfolioList
    const filteredList = this.state.filteredPortfolioList
    const iD = e.target.parentNode.parentNode.id
    unfilteredList.map((stock, i) => {
      if (stock[0] === filteredList[iD][0]) {
        const valuesList = this.state.stockValuesList
        unfilteredList.splice(i, 1)
        this.setState({portfolioValue: Math.floor((this.state.portfolioValue - this.state.stockValuesList[i]) * 100) / 100}, () => {
          valuesList.splice(i, 1)
          this.setState({stockValuesList: valuesList})
        })
      }
      return unfilteredList;
    })
    this.setState({portfolioList: unfilteredList}, () => {
      this.setState({filteredPortfolioList: this.state.portfolioList.filter(stock => {
        return stock[0].includes(this.state.filterInput.toUpperCase())
      })})
    })
  }

  onSearchChange = (e) => {
    this.setState({searchInput: e.target.value.toUpperCase()})
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

  onBackToSearch = () => {
    this.setState({searchInput: this.state.previousSearchInput}, () => {
      this.getStocksFunction()
    })
    document.querySelector('.notesinput').value = ''
    document.querySelector('.add_value').value = ''
    document.querySelector('.filterinput').value = ''
    this.setState({notesInput: ''})
    this.setState({sharesInput: ''})
    this.setState({filterInput: ''})
  }

  getStocksFunction = () => {
    this.setState({showInfo: false})
    this.setState({apiPromiseRejection: false})
    if (this.state.searchInput === '') {
      this.showBadSearchMessage()
      this.unmountStockList()
    } else {
      this.hideScrollDownIcon()
      this.setState({apiLoading: true})
      this.setState({badSearch: false})
      this.unmountStockList()
      fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.state.searchInput}&apikey=0TNNIAKWYZEM67YS`)
      .then(response => response.json())
      .then(stocks => this.setState({stockList: stocks['bestMatches']}, () => {
        if (this.state.stockList.length === 0) {
          this.showBadSearchMessage()
          this.setState({apiLoading: false})
        } else {
          this.setState({showStockList: true})
          this.setState({apiLoading: false})
          this.showScrollDownIcon()
        }
      }))
      .catch((error) => {
        this.setState({apiPromiseRejection: true})
        console.log(error)
      })
      document.querySelector('.searchBar').value = ''
      this.setState({previousSearchInput: this.state.searchInput}, () => {
        this.setState({searchInput: ''})
      })
    }
  }

  getInfoFunction = (e) => {
    this.unmountStockList()
    this.setState({apiLoading: true})
    this.hideScrollDownIcon()
    this.setState({userStockSelection: this.state.stockList[e.target.id]['1. symbol']}, () => {
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.state.userStockSelection}&apikey=0TNNIAKWYZEM67YS`)
      .then(response => response.json())
      .then(info => this.setState({statistics: info['Global Quote']}, () => {
        this.setState({apiLoading: false})
        this.showScrollDownIcon()
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
              <button className='searchButton' onClick={this.getStocksFunction}>Go!</button>
            </div>
          </div>
          <div className='twoscreencontainer'>
            <div className='info' onScroll={this.onHandleScroll}>
              <img className="scrolldownicon" src={scrolldown} alt=''></img>
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
                        numberOfSharesChange={this.onNumberOfSharesChange}
                        backToSearch={this.onBackToSearch}/>
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
          <h1>Failed to retrieve data! Check your internet, and refresh!</h1>
        </div>
      )
    }
  }
}

export default App;
