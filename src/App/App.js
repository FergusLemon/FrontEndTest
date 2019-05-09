import React from 'react'
import './App.css'
import Header from '../Header/Header.js'
import PriceInput from '../PriceInput/PriceInput.js'
import Button from '../Button/Button.js'
import validNumberRegex from '../utils/validNumberRegex.js'
import numberFormatter from '../utils/numberFormatter.js'
import forexConversionAPI from '../communications/forexConversionAPI.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.DEFAULT_VALUE = ''
    this.state = {
      value: this.DEFAULT_VALUE,
      canSearch: false,
      canSort: false,
      history: [],
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
    if (!this.doSearch.cache) {
      this.doSearch.cache = {}
    }
    if (this.doSearch.cache[value] !== undefined) {
      this.setState({ value: this.DEFAULT_VALUE })
      return
    }
    await forexConversionAPI
      .getRates(value)
      .then(results => {
        this.setState((state, props) => ({
          value: this.DEFAULT_VALUE,
          canSort: true,
          history: [
            ...state.history,
            [parseFloat(value), results['USD'], results['EUR']],
          ],
        }))
        this.doSearch.cache[value] = results
      })
      .catch(error => {
        this.setState({ value: this.DEFAULT_VALUE })
        console.log(
          'Something went wrong with the search, please try again later.'
        )
      })
  }

  createTableBody = () => {
    let history = this.state.history
    let tableBody = []
    for (let result of history) {
      tableBody.push(
        <tr key={result[0]}>
          <td>{numberFormatter(result[0])}</td>
          <td>{numberFormatter(result[1])}</td>
          <td>{numberFormatter(result[2])}</td>
        </tr>
      )
    }
    return tableBody
  }

  sortResults = () => {
    let history = this.state.history
    let sortedHistory = history.sort((a, b) => {
      return a[1] - b[1]
    })
    this.setState({ history: sortedHistory })
  }

  render() {
    let { value, history, canSearch, canSort } = this.state
    let canRenderTable = history.length > 0
    let canRenderSort = history.length > 1
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
          <Button handleClick={this.doSearch} canClick={canSearch}>
            {'Search'}
          </Button>
        </div>
        {canRenderSort && (
          <div className="Sort-button">
            <Button handleClick={this.sortResults} canClick={canSort}>
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
            <tbody>{this.createTableBody()}</tbody>
          </table>
        )}
      </div>
    )
  }
}

export default App
