const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')


const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data)
    console.log(data);

}

function showData(data) {
    // وقتی میزنی اینر اچ تی ام ال عر چی باشه تو اون تگ پاک میکنه و مقدار جدید جاگزاری میکنه
    result.innerHTML = `
    <ul class="songs">
      ${data.data
            .map(
                song => `<li class="d-flex justify-content-between mb-2">
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn btn-dark" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
            )
            .join('')}
    </ul>
  `;

    if (data.prev || data.next) {
        more.innerHTML = `
    ${data.prev
                ? `<button class="btn btn-primary" onclick="getMoreSongs('${data.prev}')">Prev</button>`
                : ''
            }
    ${data.next
                ? `<button class="btn btn-primary" onclick="getMoreSongs('${data.next}')">Next</button>`
                : ''
            }
  `;
    } else {
        more.innerHTML = '';
    }
}

async function getMoreSongs(url) {
    res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json();

    showData(data);
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const searchTerm = search.value.trim()

    if (!searchTerm) {
        alert('please search some thing')
    }
    else {
        searchSongs(searchTerm);
    }
})

result.addEventListener('click', e => {
    let clickedEl = e.target
    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    }
})

async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    if (data.error) {
        result.innerHTML = data.error;
    } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        result.innerHTML = `
            <h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${lyrics}</span>
        `;
    }
}