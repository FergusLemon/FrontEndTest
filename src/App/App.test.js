import React from 'react'
import App from './App'
import { shallow, mount } from 'enzyme'
import getElement from '../utils/getElement.js'
import mockForexConversionAPI from '../communications/forexConversionAPI.js'
jest.mock('../communications/forexConversionAPI.js')

const DEFAULT_VALUE = ''

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
    const MAX = 999999999999.9999
    it('is an empty string by default', () => {
      const wrapper = shallow(<App />)
      expect(wrapper.state().value).toBe(DEFAULT_VALUE)
    })

    describe('When the user enters a valid input', () => {
      const MIN = 0
      const ev = { currentTarget: { value: MIN } }
      it('updates the value on state - case minimum amount', () => {
        const wrapper = shallow(<App />)
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().value).toBe(MIN)
      })
      it('updates the value on state - case maximum amount', () => {
        const wrapper = shallow(<App />)
        ev.currentTarget.value = MAX
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().value).toBe(MAX)
      })
    })

    describe('When the user enters an invalid input', () => {
      const NEGATIVE_VALUE = -1
      const EMPTY_ARRAY = []
      const FIVE_DP = 0.12345
      const ev = { currentTarget: { value: NEGATIVE_VALUE } }
      it('does not update the value on state - case negative input', () => {
        const wrapper = shallow(<App />)
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().value).toBe(DEFAULT_VALUE)
      })
      it('does not update the value on state - case empty array', () => {
        const wrapper = shallow(<App />)
        ev.currentTarget.value = EMPTY_ARRAY
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().value).toBe(DEFAULT_VALUE)
      })
      it('does not update the value on state - case beyond maximum value', () => {
        const wrapper = shallow(<App />)
        ev.currentTarget.value = MAX + 1
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().value).toBe(DEFAULT_VALUE)
      })
      it('does not update the value on state - case 5 decimal places', () => {
        const wrapper = shallow(<App />)
        ev.currentTarget.value = FIVE_DP
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().value).toBe(DEFAULT_VALUE)
      })
    })
  })

  describe('Calling the FOREX rate conversion API', () => {
    const conversionData = { USD: 1.5, EUR: 1.25 }
    const userInput = 1
    beforeEach(() => {
      mockForexConversionAPI.getRates.mockResolvedValue(conversionData)
    })
    afterEach(() => {
      mockForexConversionAPI.getRates.mockClear()
    })

    it('calls the API when the user submits a price', async () => {
      const wrapper = shallow(<App />)
      const getRatesSpy = jest.spyOn(mockForexConversionAPI, 'getRates')
      wrapper.setState({ value: userInput })
      await wrapper
        .find('PriceInput')
        .props()
        .doSearch()
      expect(getRatesSpy).toHaveBeenCalledTimes(1)
    })
  })
})
