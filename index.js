const {
	isAlphabetical,
	isNumeric,
	pred,
	isWhitespace,
	anyCharacter,
	zeroOrMore,
} = require('./utils');

const identifier = input => {
	const [nextInput1, result1] = pred(anyCharacter, result =>
		isAlphabetical(result),
	)(input);

	const [nextInput2, result2] = zeroOrMore(
		pred(
			anyCharacter,
			result => isAlphabetical(result) || isNumeric(result) || result === '-',
		),
	)(nextInput1);

	return [nextInput2, [result1, ...result2].join('')];
};

const whitespaceChar = input => {
	pred(anyCharacter(input), result => isWhitespace(result));
};

module.exports = {
	identifier,
	whitespaceChar,
};
