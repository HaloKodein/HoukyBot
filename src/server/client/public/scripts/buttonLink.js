$(document).ready(() => {
    $('.button-link').each((_, button) => {
        const invite = $(button).data('invite')
        const link = $(button).data('to')

        const go_link = (invite)
            ? `${invite}&redirect_uri=${window.location.href}`
            : link

        $(button).on('click', () => window.location.href = go_link)
    })
})
