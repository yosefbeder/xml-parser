const { identifier } = require('./index.js');

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
