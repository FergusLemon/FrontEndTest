import React from 'react'
import './PriceInput.css'

function PriceInput(props) {
  return (
    <div className="price-input-container">
      <label className="price-input-label">
        Enter a price in £GBP up to 4 decimal places
      </label>
      <input
        className="price-input-field"
        type="text"
        value={props.value}
        onChange={ev => props.handleChange(ev)}
        onKeyDown={ev =>
          ev.key === 'Enter' && props.canSearch && props.doSearch(ev)
        }
      />
    </div>
  )
}

export default PriceInput
