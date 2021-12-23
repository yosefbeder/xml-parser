const xmlParser = require('..');

test('it should parse the document', () => {
	expect(
		xmlParser(`
    <top label="Top">
        <semi-bottom label="Bottom"/>
        <middle>
            <bottom label="Another bottom"/>
        </middle>
    </top>
  `),
	).toEqual([
		'',
		{
			attributes: [['label', 'Top']],
			children: [
				{
					attributes: [['label', 'Bottom']],
					children: [],
					name: 'semi-bottom',
				},
				{
					attributes: [],
					children: [
						{
							attributes: [['label', 'Another bottom']],
							children: [],
							name: 'bottom',
						},
					],
					name: 'middle',
				},
			],
			name: 'top',
		},
	]);
});
