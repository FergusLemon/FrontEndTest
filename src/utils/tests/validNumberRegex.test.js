import validNumberRegex from '../validNumberRegex.js'

describe('When a valid input is tested', () => {
  it('returns true', () => {
    const validInputs = [
      '0.1',
      '0.22',
      '0.333',
      '0.4444',
      '5',
      '66',
      '777.1234',
      '999999999999',
      '999999999999.9999',
    ]
    let results = validInputs.map(input => {
      return validNumberRegex.test(input)
    })
    expect(results.every(result => result === true)).toEqual(true)
  })
})

describe('When an invalid input is tested', () => {
  it('returns false', () => {
    const invalidInputs = [
      '-0.1',
      '-100',
      '2.34567',
      '10000000000000000000000000000000000',
      'abc',
      'e234',
      '.12',
      '.',
      '00.1',
      '[]',
      '{}',
      {},
      null,
      undefined,
    ]
    let results = invalidInputs.map(input => {
      return validNumberRegex.test(input)
    })
    expect(results.every(result => result === false)).toEqual(true)
  })
})
