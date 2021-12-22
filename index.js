const {
	isAlphabetical,
	isNumeric,
	pred,
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

module.exports = {
	identifier,
};
