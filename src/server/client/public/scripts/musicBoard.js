$(document).ready(() => {
    const socket = io()

    const queueDiv = document.querySelector('#queue')
    const playerDiv = document.querySelector('#player')

    const songs = new Array()

    function updateContext(newSong) {
        songs.push(newSong)

        queueDiv.innerHTML = ''
        playerDiv.innerHTML = ''

        playerDiv.innerHTML = `
            <div class="w-16 h-16 bg-gray-700 rounded overflow-hidden">
                <img
                    class="w-full h-full object-cover object-center"
                    src="${ newSong?.thumbnail ?? '' }"
                    alt=" "
                >
            </div>
            <div class="ml-2 flex flex-col self-center">
                <h1 class="text-indigo-100">${ (newSong?.name?.length + 16) ? `${newSong?.name?.slice(0, 16)}...` : newSong?.name ?? 'Song Name' }</h1>
                <p class="text-gray-500">${ newSong?.uploader?.name ?? 'Author' }</p>
            </div>
        `

        songs.forEach(song => {
            queueDiv.innerHTML += `
                <div class="flex w-full h-full mt-2 cursor-pointer">
                    <div class="ml-2 flex w-full items-center">
                        <div class="w-16 h-16 bg-gray-700 rounded overflow-hidden">
                            <img
                                class="w-full h-full object-cover object-center"
                                src="${ song?.thumbnail ?? '' }"
                                alt=" "
                            >
                        </div>
                        <h1 class="text-indigo-100 ml-2">${ song?.name ?? 'Song Name' }</h1>
                    </div>
                    <div class="p-4 flex justify-between">
                        <div class="w-32">
                            <h1 class="text-indigo-100 text-center">${ song?.uploader?.name ?? 'Author' }</h1>
                        </div>
                        <div class="w-32">
                            <h1 class="text-indigo-100 text-center">None</h1>
                        </div>
                        <div class="w-32">
                            <h1 class="text-gray-400 text-center">${ song.formattedDuration ?? '00:00' }</h1>
                        </div>
                    </div>
                </div>
            `
        })
    }

    socket.on('songs_update', (newSongs) => {
        newSongs.forEach(song => songs.push(song))
    })

    socket.on('song_playing', updateContext)

    socket.on('song_added', updateContext)
})