module.exports = {
    presets: ['next/babel'],
    plugins: [
        process.env.NODE_ENV === 'development' ? 'istanbul' : '',
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        'babel-plugin-parameter-decorator',
    ],
}
