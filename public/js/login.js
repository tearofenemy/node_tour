const login = async (email, password) => {
    console.log(email, password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:8001/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        console.log(res);
    } catch (e) {
        console.log(e.message);
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
});