const {
	identifier,
	quotedString,
	attributes,
	attributePair,
	whitespaceChar,
	elementStart,
	singleElement,
	parentElement,
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

describe('attributePair', () => {
	it('should parse the given attribute', () => {
		expect(attributePair('class="node"')).toEqual(['', ['class', 'node']]);
		expect(attributePair('style="position: absolute;"')).toEqual([
			'',
			['style', 'position: absolute;'],
		]);
		expect(attributePair('data-level="3"')).toEqual(['', ['data-level', '3']]);
	});
});

describe('attributes', () => {
	it('should parse all of the attributes', () => {
		expect(
			attributes(' class="node"  style="position: absolute;"		data-level="3" />'),
		).toEqual([
			' />',
			[
				['class', 'node'],
				['style', 'position: absolute;'],
				['data-level', '3'],
			],
		]);
	});
});

describe('elementStart', () => {
	it('should parse the element and return the name and attributes', () => {
		expect(
			elementStart(
				'<div class="node" style="position: absolute;" data-level="3" />',
			),
		).toEqual([
			' />',
			[
				'div',
				[
					['class', 'node'],
					['style', 'position: absolute;'],
					['data-level', '3'],
				],
			],
		]);
	});
});

describe('singleElement', () => {
	it('should return and object that represents the element', () => {
		expect(
			singleElement(
				'<div class="node" style="position: absolute;" data-level="3" />',
			),
		).toEqual([
			'',
			{
				name: 'div',
				attributes: [
					['class', 'node'],
					['style', 'position: absolute;'],
					['data-level', '3'],
				],
				children: [],
			},
		]);
	});
});

describe('parentElement', () => {
	it('should parse the element and its closing tag', () => {
		expect(
			parentElement(
				'<div class="node" style="position: absolute;" data-level="3"></div>',
			),
		).toEqual([
			'',
			{
				name: 'div',
				attributes: [
					['class', 'node'],
					['style', 'position: absolute;'],
					['data-level', '3'],
				],
				children: [],
			},
		]);
	});

	it('should parse the elements inside', () => {
		expect(
			parentElement(
				'<div class="node" style="position: absolute;" data-level="3">\n\t<div class="node node--left"></div>\n\t<div class="node node--right" />\n</div>',
			),
		).toEqual([
			'',
			{
				name: 'div',
				attributes: [
					['class', 'node'],
					['style', 'position: absolute;'],
					['data-level', '3'],
				],
				children: [
					{
						name: 'div',
						attributes: [['class', 'node node--left']],
						children: [],
					},
					{
						name: 'div',
						attributes: [['class', 'node node--right']],
						children: [],
					},
				],
			},
		]);
	});
});
