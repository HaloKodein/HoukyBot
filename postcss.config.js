const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
        './src/server/client/**/*.ejs'
    ],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g)
})

module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('cssnano'),
        purgecss
    ]
}