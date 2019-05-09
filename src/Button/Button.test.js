import React from 'react'
import { shallow } from 'enzyme'
import Button from './Button.js'

describe('The Button', () => {
  it('renders without crashing', () => {
    shallow(<Button />)
  })

  it('calls the handleClick callback when clicked', () => {
    const testEnv = { handleClick: jest.fn(), canClick: true }
    const wrapper = shallow(<Button {...testEnv}>Search</Button>)
    wrapper.find('#Search').simulate('click')
    expect(testEnv.handleClick).toHaveBeenCalled()
  })
  it('does not call the handleClick callback when clicked if canClick is "false"', () => {
    const testEnv = { handleClick: jest.fn(), canClick: false }
    const wrapper = shallow(<Button {...testEnv}>Search</Button>)
    wrapper.find('#Search').simulate('click')
    expect(testEnv.handleClick).not.toHaveBeenCalled()
  })
})
