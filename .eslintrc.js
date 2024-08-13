module.exports = {
	root: true,
	extends: '@react-native',
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'import'],
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
			rules: {
				'@typescript-eslint/no-shadow': ['error'],
				'no-shadow': 'off',
				'no-undef': 'off',
				semi: [2, 'never'],
				'jsx-quotes': [2, 'prefer-single'],
				'import/no-default-export': 'error',
				'import/order': [
					'error',
					{
						groups: [
							'builtin',
							'external',
							'internal',
							'parent',
							'sibling',
							'index',
						],
						pathGroups: [
							{
								pattern: 'react',
								group: 'builtin',
								position: 'before',
							},
							{
								pattern: 'react-native',
								group: 'builtin',
								position: 'before',
							},
							{
								pattern: '@gp-digital/**',
								group: 'sibling',
								position: 'after',
							},
							{
								pattern: '**/assets/**',
								group: 'sibling',
								position: 'after',
							},
						],
						pathGroupsExcludedImportTypes: ['builtin'],
						'newlines-between': 'always',
						alphabetize: {
							order: 'asc',
							caseInsensitive: true,
						},
					},
				],
				'@typescript-eslint/naming-convention': [
					'error',
					{
						selector: 'interface',
						format: ['PascalCase'],
						prefix: ['I'],
					},
					{
						selector: 'typeAlias',
						format: ['PascalCase'],
						prefix: ['T', 'I'],
					},
					{
						selector: 'enum',
						format: ['PascalCase'],
						prefix: ['E'],
					},
				],
			},
		},
		{
			files: ['jest.setup.js'],
			env: {
				'jest/globals': true,
			},
		},
	],
	env: {
		jest: true,
	},
}
