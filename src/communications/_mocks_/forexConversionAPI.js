export const getRatesMock = jest
  .fn()
  .mockImplementation(() => new Promise.resolve({ data: {} }))

const mock = jest.fn().mockImplementation(() => {
  return {
    getRates: getRatesMock,
  }
})

export default mock()
