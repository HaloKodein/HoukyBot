$(document).ready(() => {
    $('.nav-toggler').each((_, navToggler) => {
        const target = $(navToggler).data('target')
        $(navToggler).on('click', () => {
            $(target).animate({
                height: "toggle"
            })
        })
    })

    $('.view-toggler').each((_, viewToggler) => {
        const target = $(viewToggler).data('target')
        $(viewToggler).on('click', () => {
            $(target).animate({
                height: "toggle"
            })
        })
    })
})
