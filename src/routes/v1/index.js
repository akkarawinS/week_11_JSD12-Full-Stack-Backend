fetch('http://localhost:3000/users/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'Judas',
        email: 'joe@example.com',
        password: '1234567'
    })
})
.then(res => res.json())
.then(data => console.log(data))