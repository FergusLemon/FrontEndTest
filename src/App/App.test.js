import React from 'react'
import App from './App'
import { shallow, mount } from 'enzyme'
import getElement from '../utils/getElement.js'

describe('The FX Service App', () => {
  it('renders without crashing', () => {
    shallow(<App />)
  })

  it('renders with a Header', () => {
    const wrapper = mount(<App />)
    expect(getElement(wrapper)('div')('App-header').text()).toBe(
      'Forex Rates Service'
    )
  })
  it('renders with an input field', () => {
    const wrapper = mount(<App />)
    expect(getElement(wrapper)('input')('price-input-field').exists()).toBe(
      true
    )
  })
  it('renders with a button', () => {
    const wrapper = mount(<App />)
    expect(getElement(wrapper)('button')('submit-rate-request').exists()).toBe(
      true
    )
    expect(getElement(wrapper)('button')('submit-rate-request').text()).toBe(
      'Submit'
    )
  })

  describe('Passing props to child components', () => {
    it('passes down on props the value, handleChange and doSearch functions and canSearch flag to the PriceInput component', () => {
      const wrapper = shallow(<App />)
      const props = wrapper.find('PriceInput').props()
      const keys = ['value', 'handleChange', 'doSearch', 'canSearch']
      expect(keys.every(key => key in props)).toBe(true)
    })
  })

  describe('Capturing the GBP value entered by a user', () => {
    it('is an empty string by default', () => {
      const wrapper = shallow(<App />)
      expect(wrapper.state().value).toBe('')
    })
  })
})
