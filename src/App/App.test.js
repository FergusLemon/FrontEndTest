import React from 'react'
import App from './App'
import { shallow, mount } from 'enzyme'
import getElement from '../utils/getElement.js'
import mockForexConversionAPI from '../communications/forexConversionAPI.js'
jest.mock('../communications/forexConversionAPI.js')

const DEFAULT_VALUE = ''
const result = [1, 2, 3]
const anotherResult = [4, 5, 6]

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
    wrapper.setState({ history: [result, anotherResult] })
    expect(wrapper.find('#Sort').exists()).toBe(true)
    expect(wrapper.find('#Sort').text()).toBe('Sort')
  })
  it('does not render a table if there is nothing to display', () => {
    const wrapper = mount(<App />)
    expect(getElement(wrapper)('table')('Currency-table').exists()).toBe(false)
  })
  it('renders a table if there is atleast one result to display', () => {
    const wrapper = mount(<App />)
    wrapper.setState({ history: [result] })
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
      it('should store the results from the API in the history on state', async () => {
        const wrapper = shallow(<App />)
        wrapper.setState({ value: userInput })
        await wrapper
          .find('PriceInput')
          .props()
          .doSearch()
        let history = wrapper.state().history
        let firstResult = history[0]
        expect(history.length).toBe(1)
        expect(firstResult[0]).toBe(userInput)
        expect(firstResult[1]).toBe(conversionData['USD'])
        expect(firstResult[2]).toBe(conversionData['EUR'])
      })
      it('should not call the API if the amount has already been successfully searched for', async () => {
        const wrapper = shallow(<App />)
        wrapper.setState({
          value: userInput,
          history: [result],
        })
        wrapper.instance().doSearch.cache = { [userInput]: {} }
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

  describe('Displaying results', () => {
    const tableHeadRow = 1
    it('displays each new result on the page - case 1 result', () => {
      const wrapper = mount(<App />)
      wrapper.setState({ history: [result] })
      let tableRows = wrapper.find('tr')
      expect(tableRows.length - tableHeadRow).toBe(1)
    })
    it('displays each new result on the page - case 2 results', () => {
      const wrapper = mount(<App />)
      wrapper.setState({ history: [result, anotherResult] })
      let tableRows = wrapper.find('tr')
      expect(tableRows.length - tableHeadRow).toBe(2)
    })
  })

  describe('Sorting results', () => {
    let wrapper
    const oneMoreResult = { USD: 5, EUR: 3.9 }
    const userInput = 2.75
    beforeEach(() => {
      wrapper = shallow(<App />)
      wrapper.setState({ history: [anotherResult, result] })
    })
    it('sorts the results in ascending order', () => {
      wrapper.instance().sortResults()
      expect(wrapper.state().history[0]).toBe(result)
    })
    it('sets canSort to false after sorting', () => {
      wrapper.instance().sortResults()
      expect(wrapper.state().canSort).toBe(false)
    })
    it('sets canSort to true when a new result is retrieved from the API', async () => {
      mockForexConversionAPI.getRates.mockResolvedValue([oneMoreResult])
      wrapper.setState({ value: userInput })
      await wrapper
        .find('PriceInput')
        .props()
        .doSearch()
      expect(wrapper.state().canSort).toBe(true)
      expect(wrapper.state().history.length).toBe(3)
    })
  })
})
