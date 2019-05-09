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
    this.state = {
      value: '',
      canSearch: false,
      cache: {},
    }
  }

  handleChange = event => {
    const userInput = event.currentTarget.value
    if (this.isInvalid(userInput)) return
    return this.setState({ value: userInput })
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
    await forexConversionAPI
      .getRates(value)
      .then(results => {
        this.setState({
          cache: { [value]: results },
          canSearch: true,
        })
      })
      .catch(error => {
        this.setState({ canSearch: true })
        console.log(
          'Something went wrong with the search, please try again later.'
        )
      })
  }

  render() {
    let { value, canSearch } = this.state
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
          <Button />
        </div>
      </div>
    )
  }
}

export default App
