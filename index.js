const {
	isAlphabetical,
	isNumeric,
	pred,
	isWhitespace,
	anyCharacter,
	zeroOrMore,
	pair,
	matchLiteral,
	map,
	left,
	right,
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

const quotedString = input => {
	const quoteParser = matchLiteral('"');
	const valueParser = zeroOrMore(pred(anyCharacter, result => result !== '"'));

	const startParser = map(right(pair(quoteParser, valueParser)), result =>
		result.join(''),
	);

	return left(pair(startParser, quoteParser))(input);
};

module.exports = {
	identifier,
	whitespaceChar,
	quotedString,
};
