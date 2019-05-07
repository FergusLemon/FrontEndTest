//RegExp used for valdiating numbers entered as strings by the user.
//Non-capturing groups were used.
//First RegExp group matches an empty string.
//Second group matches a single 0.
//Third group matches a single 0 with a decimal point
//and then between zero and four digits that range between 0-9.
//Fourth group matches numbers in the range 1-999,999,999,999.
//Fifth group matches numbers in the same range as the fourth group but
//includes decimal numbers up to four decimal places.
const regex = /^$|^(?:0)$|^(?:0\.[0-9]{0,4})$|^(?:[1-9]{1}[0-9]{0,11})$|^(?:[1-9]{1}[0-9]{0,11}\.[0-9]{0,4})$/

export default regex
