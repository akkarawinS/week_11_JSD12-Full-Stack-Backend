fetch('http://localhost:3000/users/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'ji',
        email: 'joe@example.com',
        password: '1234567'
    })
})
.then(res => res.json())
.then(data => console.log(data))