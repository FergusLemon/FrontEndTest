import React from 'react'
import './Button.css'

function Button(props) {
  return (
    <div className="button-container">
      <button
        className="submit-request"
        id={props.children}
        onClick={ev => props.canClick && props.handleClick()}
      >
        {props.children}
      </button>
    </div>
  )
}

export default Button
