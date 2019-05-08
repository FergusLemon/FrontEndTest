import React from 'react'
import './App.css'
import Header from '../Header/Header.js'
import PriceInput from '../PriceInput/PriceInput.js'
import Button from '../Button/Button.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      canSearch: true,
    }
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
            handleChange={() => {}}
            doSearch={() => {}}
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
