const hideAlert = () => {
    const el = document.querySelector('.alert');
    if(el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
    const markup = `<div class='alert alert--${type}'>${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:8001/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if(res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (e) {
        showAlert('error', e.message);
    }
}

const signUp = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:8001/api/v1/users/signup',
            data
        });

        if(res.data.status === 'success') {
            showAlert('success', 'Account successfully signed');
            window.setTimeout(() => {
                location.assign('/login');
            });
        }
    } catch (e) {
        showAlert('error', e.message);
    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:8001/api/v1/users/logout' 
        });
        if(res.data.status === 'success') {
            location.assign('/login');
        }
    } catch(e) {
        showAlert('error', e.message);
    }
}

window.onload = () => {
    document.getElementById('user_log').addEventListener('click', logout);
}

//login
document.querySelector('.form--login').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

//signup
document.querySelector('.form--signup').addEventListener('submit', e => {
    e.preventDefault();

    //const signUpForm = new FormData();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // signUpForm.append('name', document.getElementById('name').value);
    // signUpForm.append('email', document.getElementById('email').value);
    // signUpForm.append('password', document.getElementById('password').value);
    // signUpForm.append('confirmPassword', document.getElementById('confirmPassword').value);

    //console.log(name, email, password, confirmPassword);

    //signUp(signUpForm);
    signUp({name, email, password, confirmPassword});
});