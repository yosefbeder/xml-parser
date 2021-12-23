const { isAlphabetical, isNumeric, isWhitespace } = require('./utils');
const {
	matchLiteral,
	pair,
	map,
	left,
	right,
	oneOrMore,
	zeroOrMore,
	anyCharacter,
	pred,
	andThen,
	whitespaceWrap,
	either,
} = require('./utils/parser-combinators.js');

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

	const startParser = map(right(quoteParser, valueParser), result =>
		result.join(''),
	);

	return left(startParser, quoteParser)(input);
};

const whitespaceChar = input => {
	return pred(anyCharacter, result => isWhitespace(result))(input);
};

const whitespace1 = input => {
	return oneOrMore(whitespaceChar)(input);
};

const whitespace0 = input => {
	return zeroOrMore(whitespaceChar)(input);
};

const attributePair = input => {
	return pair(identifier, right(matchLiteral('='), quotedString))(input);
};

const attributes = input => {
	return zeroOrMore(right(whitespace1, attributePair))(input);
};

const elementStart = input => {
	return pair(right(matchLiteral('<'), identifier), attributes)(input);
};

const singleElement = input => {
	return map(
		left(elementStart, pair(whitespace0, matchLiteral('/>'))),
		([name, attributes]) => ({ name, attributes, children: [] }),
	)(input);
};

const openElement = input => {
	return map(
		left(elementStart, pair(whitespace0, matchLiteral('>'))),
		([name, attributes]) => ({ name, attributes, children: [] }),
	)(input);
};

function parentElement(input) {
	return andThen(openElement, ({ name, attributes }) => {
		return input => {
			const [nextInput, children] = left(
				zeroOrMore(element),
				matchLiteral(`</${name}>`),
			)(input);

			return [nextInput, { name, attributes, children }];
		};
	})(input);
}

function element(input) {
	return right(
		whitespace0,
		left(either(singleElement, parentElement), whitespace0),
	)(input);
}

module.exports = {
	identifier,
	whitespaceChar,
	whitespace1,
	whitespace0,
	quotedString,
	attributePair,
	attributes,
	elementStart,
	singleElement,
	parentElement,
	element,
};
