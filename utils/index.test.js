const {
	matchLiteral,
	pair,
	map,
	zeroOrMore,
	oneOrMore,
	pred,
	anyCharacter,
	either,
	andThen,
	right,
} = require('./index.js');
const { identifier, whitespace1 } = require('../index.js');

describe('matchLiteral', () => {
	const parser = matchLiteral('ha');

	it('should return the rest of the string (if succeeded)', () => {
		expect(parser('haha')).toEqual(['ha', null]);
		expect(parser('ha')).toEqual(['', null]);
	});

	it('should throw an error containing the full string (if failed)', () => {
		expect(() => parser('ahah')).toThrowError('ahah');
	});
});

describe('pair', () => {
	const parser = pair(matchLiteral('<'), identifier);

	it('should return a new parser which combines the two passed', () => {
		expect(parser('<some-identifier />')).toEqual([
			' />',
			[null, 'some-identifier'],
		]);
	});

	it('should throw the errors thrown from the parsers passed', () => {
		expect(() => parser('!some-identifier />')).toThrowError(
			'!some-identifier',
		);
		expect(() => parser('<!ome-identifier />')).toThrowError('!ome-identifier');
	});
});

describe('map', () => {
	const parser = map(pair(matchLiteral('<'), identifier), result => result[1]);

	it('should map the result and return the rest of the string', () => {
		expect(parser('<some-identifier />')).toEqual([' />', 'some-identifier']);
	});

	it('should throw the error thrown from the parser passed', () => {
		expect(() => parser('!some-identifier />')).toThrowError(
			'!some-identifier',
		);
		expect(() => parser('<!ome-identifier />')).toThrowError('!ome-identifier');
	});
});

describe('oneOrMore', () => {
	const parser = oneOrMore(matchLiteral('ha'));

	it('should return the rest of the string (if found more or one) and an array of results', () => {
		expect(parser('haha')).toEqual(['', [null, null]]);
		expect(parser('ha')).toEqual(['', [null]]);
		expect(parser('habaha')).toEqual(['baha', [null]]);
	});

	it('should throw an error containing the full string (if failed)', () => {
		expect(() => parser('ahah')).toThrowError('ahah');
	});
});

describe('zeroOrMore', () => {
	const parser = zeroOrMore(matchLiteral('ha'));

	it('should return the rest of the string and an array of results', () => {
		expect(parser('haha')).toEqual(['', [null, null]]);
		expect(parser('ha')).toEqual(['', [null]]);
		expect(parser('habaha')).toEqual(['baha', [null]]);
		expect(parser('ahah')).toEqual(['ahah', []]);
	});
});

describe('anyCharacter', () => {
	it('should match any character and return it with the rest of the string', () => {
		expect(anyCharacter('haha')).toEqual(['aha', 'h']);
	});

	it('should throw an error with empty strings', () => {
		expect(() => anyCharacter('')).toThrowError('');
	});
});

describe('pred', () => {
	const parser = pred(anyCharacter, result => result === 'o');

	it('should only parse if the result of the first parser matches the predicate function', () => {
		expect(parser('omg')).toEqual(['mg', 'o']);
		expect(() => parser('lol')).toThrowError('lol');
	});

	it('should throw the error thrown from the parser passed', () => {
		expect(() => anyCharacter('')).toThrowError('');
	});
});

describe('either', () => {
	const parser = either(matchLiteral('yosef'), matchLiteral('mostafa'));

	it('should skip the second if the first works fine', () => {
		expect(parser('yosef')).toEqual(['', null]);
	});

	it('should apply the second if the first one threw an error', () => {
		expect(parser('mostafa')).toEqual(['', null]);
	});

	it('should throw an error if both parsers failed', () => {
		expect(() => parser('zozo')).toThrowError('zozo');
	});
});

describe('andThen', () => {
	const parser = andThen(identifier, name => {
		return input => {
			return right(whitespace1, matchLiteral(name))(input);
		};
	});

	it('should apply the created parser to the part that the previous parser left', () => {
		expect(parser('yosef yosef beder')).toEqual([' beder', null]);
		expect(() => parser('yosef beder')).toThrowError('beder');
		expect(() => parser('yosefyosef')).toThrowError('');
	});
});
