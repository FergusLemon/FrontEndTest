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
  it('renders with a search button', () => {
    const wrapper = mount(<App />)
    expect(wrapper.find('#Search').exists()).toBe(true)
    expect(wrapper.find('#Search').text()).toBe('Search')
  })
  it('does not render a sort button if there is nothing to sort', () => {
    const wrapper = mount(<App />)
    expect(wrapper.find('#Sort').exists()).toBe(false)
  })
  it('renders a sort button if there are results to sort', () => {
    const wrapper = mount(<App />)
    wrapper.setState({ cache: { '1': { USD: 1.5 }, '2': { USD: 3 } } })
    expect(wrapper.find('#Sort').exists()).toBe(true)
    expect(wrapper.find('#Sort').text()).toBe('Sort')
  })
  it('does not render a table if there is nothing to display', () => {
    const wrapper = mount(<App />)
    expect(getElement(wrapper)('table')('Currency-table').exists()).toBe(false)
  })
  it('renders a table if there is atleast one result to display', () => {
    const wrapper = mount(<App />)
    wrapper.setState({ cache: { '1': { USD: 1.5 } } })
    expect(getElement(wrapper)('table')('Currency-table').exists()).toBe(true)
  })

  describe('Passing props to child components', () => {
    it(`passes down on props the value, handleChange and doSearch functions
    and canSearch flag to the PriceInput component`, () => {
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
      it('sets canSearch to true', () => {
        const wrapper = shallow(<App />)
        wrapper
          .find('PriceInput')
          .props()
          .handleChange(ev)
        expect(wrapper.state().canSearch).toBe(true)
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
    const userInputString = '1'
    const getRatesSpy = jest.spyOn(mockForexConversionAPI, 'getRates')
    beforeEach(() => {
      mockForexConversionAPI.getRates.mockResolvedValue(conversionData)
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('calls the API when the user submits a price', async () => {
      const wrapper = shallow(<App />)
      wrapper.setState({ value: userInput })
      await wrapper
        .find('PriceInput')
        .props()
        .doSearch()
      expect(getRatesSpy).toHaveBeenCalledTimes(1)
    })
    it('should set canSearch to false before the doSearch promise fires', () => {
      const wrapper = shallow(<App />)
      wrapper.setState({ value: userInput, canSearch: true })
      wrapper
        .find('PriceInput')
        .props()
        .doSearch()
      expect(wrapper.state().canSearch).toBe(false)
    })
    it('should set canSearch to false if the value on state is an empty string', () => {
      const wrapper = shallow(<App />)
      wrapper.setState({ value: DEFAULT_VALUE })
      expect(wrapper.state().canSearch).toBe(false)
    })

    describe('When the call to the API returns a resolved Promise', () => {
      it('should store the results from the API in the cache on state', async () => {
        const wrapper = shallow(<App />)
        wrapper.setState({ value: userInput })
        await wrapper
          .find('PriceInput')
          .props()
          .doSearch()
        let keys = Object.keys(wrapper.state().cache)
        let values = Object.values(wrapper.state().cache)
        expect(keys.length).toBe(1)
        expect(keys[0]).toBe(userInputString)
        expect(values[0]).toBe(conversionData)
      })
      it('should not call the API if the search amount is already in the cache on state', async () => {
        const wrapper = shallow(<App />)
        wrapper.setState({
          value: userInput,
          cache: { [userInputString]: conversionData },
        })
        await wrapper
          .find('PriceInput')
          .props()
          .doSearch()
        expect(getRatesSpy).not.toHaveBeenCalled()
      })
      it('should reset the value on state to an empty string', async () => {
        const wrapper = shallow(<App />)
        wrapper.setState({
          value: userInput,
        })
        await wrapper
          .find('PriceInput')
          .props()
          .doSearch()
        expect(wrapper.state().value).toBe(DEFAULT_VALUE)
      })
    })
  })
})
