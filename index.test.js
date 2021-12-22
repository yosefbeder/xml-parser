const {
	identifier,
	quotedString,
	attributes,
	attributePair,
	whitespaceChar,
} = require('./index.js');

describe('identifier', () => {
	it('should match alphabetical, numeric, and - and return the rest of the string', () => {
		expect(identifier('yosef123')).toEqual(['', 'yosef123']);
		expect(identifier('yosef-beder')).toEqual(['', 'yosef-beder']);
		expect(identifier('yosef')).toEqual(['', 'yosef']);
		expect(identifier('yosef beder')).toEqual([' beder', 'yosef']);
	});

	it('should throw an error if the first character of an identifier is a not alphatical', () => {
		expect(() => identifier('1jj')).toThrowError('1jj');
		expect(() => identifier('!jj')).toThrowError('!jj');
	});
});

describe('quotedString', () => {
	it('should parse a string between two "" and return the parsed string and the rest of the input', () => {
		expect(quotedString('"handleClick()"></button>')).toEqual([
			'></button>',
			'handleClick()',
		]);
		expect(quotedString('"cool-stuff"')).toEqual(['', 'cool-stuff']);
	});

	it("should throw an error if the first item isn't a double quote", () => {
		expect(() => quotedString('cool-stuff"')).toThrowError('cool-stuff"');
	});

	it("should throw an error if the last item isn't a double quote", () => {
		expect(() => quotedString('"cool-stuff')).toThrowError('');
	});
});

describe('whitespaceChar', () => {
	it('should parse whitespaces, tabs, and new lines', () => {
		expect(whitespaceChar(' ddd')).toEqual(['ddd', ' ']);
		expect(whitespaceChar('\t')).toEqual(['', '\t']);
		expect(whitespaceChar('\n')).toEqual(['', '\n']);
	});
});
