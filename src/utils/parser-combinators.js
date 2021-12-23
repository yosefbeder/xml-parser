const { whitespace0 } = require('../parsers.js');

const matchLiteral = expected => {
	return input => {
		if (input.slice(0, expected.length) === expected) {
			return [input.slice(expected.length), null];
		} else {
			throw new Error(input);
		}
	};
};

const pair = (parser1, parser2) => {
	return input => {
		const [nextInput1, result1] = parser1(input);
		const [nextInput2, result2] = parser2(nextInput1);

		return [nextInput2, [result1, result2]];
	};
};

const map = (parser, mapFn) => {
	return input => {
		const [nextInput, result] = parser(input);

		return [nextInput, mapFn(result)];
	};
};

const left = (parser1, parser2) =>
	map(pair(parser1, parser2), result => result[0]);

const right = (parser1, parser2) =>
	map(pair(parser1, parser2), result => result[1]);

const oneOrMore = parser => {
	return input => {
		let nextInput = input;
		const results = [];

		const [curNextInput, result] = parser(input);

		nextInput = curNextInput;
		results.push(result);

		while (true) {
			try {
				const [curNextInput, result] = parser(nextInput);
				nextInput = curNextInput;
				results.push(result);
			} catch (_) {
				return [nextInput, results];
			}
		}
	};
};

const zeroOrMore = parser => {
	return input => {
		let nextInput = input;
		const results = [];

		while (true) {
			try {
				const [curNextInput, result] = parser(nextInput);
				nextInput = curNextInput;
				results.push(result);
			} catch (_) {
				return [nextInput, results];
			}
		}
	};
};

const anyCharacter = input => {
	if (input[0]) return [input.slice(1), input[0]];
	else throw new Error(input);
};

const pred = (parser, predicate) => {
	return input => {
		const [nextInput, result] = parser(input);

		if (predicate(result)) {
			return [nextInput, result];
		} else {
			throw new Error(input);
		}
	};
};

const either = (parser1, parser2) => {
	return input => {
		try {
			return parser1(input);
		} catch (_) {
			return parser2(input);
		}
	};
};

const andThen = (parser, fn) => {
	return input => {
		const [nextInput, result1] = parser(input);

		return fn(result1)(nextInput);
	};
};

const whitespaceWrap = parser => {
	return input => {
		return right(whitespace0, left(parser, whitespace0))(input);
	};
};

module.exports = {
	matchLiteral,
	pair,
	map,
	left,
	right,
	oneOrMore,
	zeroOrMore,
	anyCharacter,
	pred,
	either,
	andThen,
	whitespaceWrap,
};
