//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberFormatter = num => {
  let numSplit = num.toString().split('.')
  numSplit[0] = numSplit[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return numSplit.join('.')
}

export default numberFormatter
