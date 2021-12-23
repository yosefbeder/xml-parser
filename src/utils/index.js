const isAlphabetical = char => /[a-z]|[A-Z]/.test(char);

const isNumeric = char => /[0-9]/.test(char);

const isWhitespace = char => /\s/.test(char);

module.exports = {
	isAlphabetical,
	isNumeric,
	isWhitespace,
};
