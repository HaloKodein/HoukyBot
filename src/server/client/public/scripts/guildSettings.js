$(document).ready(() => {
    const button = $('#submitButton')

    $(button).on('click', async () => {
        const bot_name = $('#bot_name').val()
        const dj_role = $('#dj_role').val()

        const promise = await fetch(window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bot_name,
                dj_role
            })
        })

        if (promise.status === 200) {
        } else {
        }
    })
})
