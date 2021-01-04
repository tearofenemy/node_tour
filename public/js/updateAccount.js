const updateSettings = async (data, type) => {
    try {
        const url = type === 'password'
                     ? 'http://localhost:8001/api/v1/users/updateMyPassword'
                     : 'http://localhost:8001/api/v1/users/updateMe';

        //const method = type === 'password' ? 'PUT' : 'PATCH';             
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        
        if(res.data.status === 'success') {
            console.log('SUCCESS UPDATED');
        }
    } catch (e) {
        throw new Error(e.message);
    }
}


document.querySelector('.form-user-data').addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('avatar', document.getElementById('avatar').files[0]);

    updateSettings(form, 'data');
});

document.querySelector('.form-user-password').addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateSettings({currentPassword, password, confirmPassword}, 'password');


    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD'
});