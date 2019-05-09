import React from 'react'
import './App.css'
import Header from '../Header/Header.js'
import PriceInput from '../PriceInput/PriceInput.js'
import Button from '../Button/Button.js'
import validNumberRegex from '../utils/validNumberRegex.js'
import forexConversionAPI from '../communications/forexConversionAPI.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.DEFAULT_VALUE = ''
    this.state = {
      value: this.DEFAULT_VALUE,
      canSearch: false,
      canSort: false,
      cache: {},
    }
  }

  handleChange = event => {
    const userInput = event.currentTarget.value
    if (this.isInvalid(userInput)) return
    return this.setState({ value: userInput, canSearch: true })
  }

  isInvalid = value => {
    return validNumberRegex.test(value) === false || this.isArray(value)
  }

  isArray = value => {
    return Object.prototype.toString.call(value).slice(8, -1) === 'Array'
  }

  doSearch = async () => {
    this.setState({ canSearch: false })
    const value = this.state.value
    if (this.state.cache[value] !== undefined) {
      this.setState({ value: this.DEFAULT_VALUE })
      return
    }
    await forexConversionAPI
      .getRates(value)
      .then(results => {
        this.setState((state, props) => ({
          value: this.DEFAULT_VALUE,
          cache: { ...state.cache, [value]: results },
        }))
      })
      .catch(error => {
        this.setState({ value: this.DEFAULT_VALUE })
        console.log(
          'Something went wrong with the search, please try again later.'
        )
      })
  }

  render() {
    let { value, cache, canSearch, canSort } = this.state
    let canRenderTable = Object.keys(cache).length >= 1
    let canRenderSort = Object.keys(cache).length >= 2
    return (
      <div className="App">
        <div className="App-header">
          <Header />
        </div>
        <div className="Price-input">
          <PriceInput
            value={value}
            handleChange={this.handleChange}
            doSearch={this.doSearch}
            canSearch={canSearch}
          />
        </div>
        <div className="Submit-button">
          <Button clickHandler={this.doSearch} canClick={canSearch}>
            {'Search'}
          </Button>
        </div>
        {canRenderSort && (
          <div className="Sort-button">
            <Button clickHandler={this.doSearch} canClick={canSort}>
              {'Sort'}
            </Button>
          </div>
        )}
        {canRenderTable && (
          <table className="Currency-table">
            <thead className="Currency-symbols">
              <tr>
                <th>£ GBP</th>
                <th>$ USD</th>
                <th>€ EUR</th>
              </tr>
            </thead>
            <tbody />
          </table>
        )}
      </div>
    )
  }
}

export default App
