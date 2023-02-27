module.exports = {
    presets: ['next/babel'],
    plugins: process.env.NODE_ENV === 'development' ? ['istanbul'] : [],
}
