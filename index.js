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
	oneOrMore,
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

const quotedString = input => {
	const quoteParser = matchLiteral('"');
	const valueParser = zeroOrMore(pred(anyCharacter, result => result !== '"'));

	const startParser = map(right(pair(quoteParser, valueParser)), result =>
		result.join(''),
	);

	return left(pair(startParser, quoteParser))(input);
};

const whitespaceChar = input => {
	return pred(anyCharacter, result => isWhitespace(result))(input);
};

const whitespace1 = input => {
	return oneOrMore(whitespaceChar)(input);
};

const attributePair = input => {
	return pair(identifier, right(pair(matchLiteral('='), quotedString)))(input);
};

const attributes = input => {
	return zeroOrMore(right(pair(whitespace1, attributePair)))(input);
};

module.exports = {
	identifier,
	whitespaceChar,
	quotedString,
	attributePair,
	attributes,
};
