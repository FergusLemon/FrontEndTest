import React from 'react'
import { shallow } from 'enzyme'
import PriceInput from './PriceInput.js'
import getElement from '../utils/getElement.js'

describe('The Price Input field', () => {
  it('renders without crashing', () => {
    shallow(<PriceInput />)
  })

  it('passes the value prop to the value of the input field', () => {
    const testEnv = { value: 1 }
    const wrapper = shallow(<PriceInput {...testEnv} />)
    expect(
      getElement(wrapper)('input')('price-input-field').props().value
    ).toBe(1)
  })
  it('calls the handleChange callback when the input changes', () => {
    const testEnv = { handleChange: jest.fn() }
    const wrapper = shallow(<PriceInput {...testEnv} />)
    getElement(wrapper)('input')('price-input-field').simulate('change')
    expect(testEnv.handleChange).toHaveBeenCalled()
  })
  it('calls the doSearch callback when the "Enter" key is pressed', () => {
    const testEnv = { doSearch: jest.fn(), canSearch: true }
    const wrapper = shallow(<PriceInput {...testEnv} />)
    getElement(wrapper)('input')('price-input-field').simulate('keydown', {
      key: 'Enter',
    })
    expect(testEnv.doSearch).toHaveBeenCalled()
  })
  it('does not call the doSearch callback when the "Enter" key is pressed if canSearch is "false"', () => {
    const testEnv = { doSearch: jest.fn(), canSearch: false }
    const wrapper = shallow(<PriceInput {...testEnv} />)
    getElement(wrapper)('input')('price-input-field').simulate('keydown', {
      key: 'Enter',
    })
    expect(testEnv.doSearch).not.toHaveBeenCalled()
  })
  it('does not call the doSearch callback when a key other than "Enter" is pressed', () => {
    const testEnv = { doSearch: jest.fn(), canSearch: true }
    const wrapper = shallow(<PriceInput {...testEnv} />)
    getElement(wrapper)('input')('price-input-field').simulate('keydown', {
      key: 'Shift',
    })
    expect(testEnv.doSearch).not.toHaveBeenCalled()
  })
})
