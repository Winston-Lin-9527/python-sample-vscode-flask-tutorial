const content_field = document.querySelector("#content_editfield");
const submit_button = document.querySelector("#submit_button");
const authorname = document.getElementById("authorname");
const pastename = document.getElementById("pastename");
const sent_logs = document.getElementById("sent_logs");


submit_button.addEventListener("click", (e) => {
    const data = {
        "content": content_field.value,
        "author" : authorname.value,
        "pastename" : pastename.value   
    }
    fetch('/send_note', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        const new_log = document.createElement('p');
        new_log.textContent = 'Created new text:' + data['uuid'];
        sent_logs.appendChild(new_log);
    })
    .catch((error) => {
        alert('Error:', error);
    });
})


const refresh_button = document.querySelector('#refresh_button')
const daily_note_display = document.querySelector("#daily_msg")

refresh_button.addEventListener("click", (e) => {
    fetch("/daily_note")
    // fetch() returns a promise. When we have received a response from the server,
    // the promise's `then()` handler is called with the response.
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        // Otherwise (if the response succeeded), our handler fetches the response
        // as text by calling response.text(), and immediately returns the promise
        // returned by `response.text()`.
        return response.text();
    })
    // When response.text() has succeeded, the `then()` handler is called with
    // the text, and we copy it into the `poemDisplay` box.
    .then((text) => daily_note_display.textContent = text)
    // Catch any errors that might happen, and display a message
    // in the `poemDisplay` box.
    .catch((error) => daily_note_display.textContent = `Could not fetch verse: ${error}`);
})


const search_button = document.querySelector('#search_button')
const searchTerm = document.querySelector("#searchTerm")

search_button.addEventListener("click", (e) => {
    const data = {
        "note_uuid": searchTerm.value,
    }
    fetch('/search_note', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            alert(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then(json_response => {
        if (json_response['status'] != 'ok') {
            throw new Error('Error: not found', json_response['content']);
        }
        console.log(json_response)
        content_field.value = json_response['data']['content']
        authorname.value = json_response['data']['author']
        pastename.value = json_response['data']['pastename']
    })
    .catch((error) => {
        alert(`Fetch problem: ${error.message}`);
    });
})