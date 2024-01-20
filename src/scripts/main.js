document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault()

    const form = document.querySelectorAll('form'), resetFrom = document.getElementById('form'),
        fullName = document.getElementById('name'), userName = document.getElementById('username'),
        email = document.getElementById('email'), password = document.getElementById('password'),
        confirmPassword = document.getElementById('password2'), checkbox = document.getElementById('checkbox'),
        errorText = document.querySelector('.error-text'), btn = document.querySelectorAll('.btn-ok'),
        popup = document.querySelector('.popup'), popupCheck = document.querySelector('.popupCheck'),
        closeOk = document.querySelector('.popup-btn'), Ok = document.querySelector('.ok'),
        formControl = document.querySelectorAll('.user-login'), formRemove = document.querySelectorAll('.form-control'),
        mainTitle = document.querySelector('.main-title'), mainSubTitle = document.querySelector('.main-sub-title'),
        link = document.querySelector('#link'), links = document.querySelector('#links'),
        btnSing = document.querySelector('.btnSing'), CLIENTS_KEY = 'clients';

    let clients = localStorage.getItem(CLIENTS_KEY) ? JSON.parse(localStorage.getItem(CLIENTS_KEY)) : [];


    function checkFullName(name) {
        const namePattern = /^[a-zA-Z\s]+$/
        if (name.value === '' || !name.value.match(namePattern)) {
            name.style.borderBottom = '1px solid red';
            name.nextElementSibling.style.display = 'block';
            return false;
        }
        name.nextElementSibling.style.display = 'none';
        name.style.borderBottom = '1px solid #C6C6C4';

        return true;
    }


    function checkUserName(login) {
        const loginPattern = /^[a-zA-Z0-9_-]+$/
        if (login.value === '' || !login.value.match(loginPattern)) {
            login.nextElementSibling.style.display = 'block';
            login.style.borderBottom = '1px solid red';
            return false;
        }
        login.nextElementSibling.style.display = 'none';
        login.style.borderBottom = '1px solid #C6C6C4';
        return true;
    }


    function checkEmail(mail) {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (mail.value === '' || !mail.value.match(emailPattern)) {
            mail.nextElementSibling.style.display = 'block';
            mail.style.borderBottom = '1px solid red';
            return false
        }
        mail.nextElementSibling.style.display = 'none';
        mail.style.borderBottom = '1px solid #C6C6C4';
        return true;
    }

    function createPass(pass) {
        const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (pass.value === '' || !pass.value.match(passPattern)) {
            pass.nextElementSibling.style.display = 'block';
            pass.style.borderBottom = '1px solid red';
            return false;
        }
        pass.nextElementSibling.style.display = 'none';
        pass.style.borderBottom = '1px solid #C6C6C4';

        return true;
    }

    function checkPassword(pass1, pass2) {
        if (pass1.value !== pass2.value || pass2.value === '') {
            pass2.nextElementSibling.style.display = 'block';
            pass2.style.borderBottom = '1px solid red';
            return false;
        } else {
            pass2.nextElementSibling.style.display = 'none';
            pass2.style.borderBottom = '1px solid #C6C6C4';
            return true;
        }
    }

    link.addEventListener('click', e => {
        e.preventDefault()
        formControl.forEach(item => {
            item.remove()
        })
        links.textContent = 'Registration'
        mainTitle.textContent = 'Log in to the system';
        btnSing.textContent = 'Sign In';

        links.style.cssText = `
                        display: block;
                        width: 210px;
                        transform: translateX(-8.5%);
                        padding: 10px;
                        border-radius: 40px;
                        background: #DD3142;
                        text-align: center;
                        color: #FFF;
                        border: none;
                        font-size: 20px;
                    `;

        links.addEventListener('click', e => {
            e.preventDefault()
            location.reload()
        })


        btnSing.addEventListener('click', (e) => {
            e.preventDefault()
            const isSignInUser = clients.find(client => client.userName === userName.value && client.password === password.value);
            const isUserName = clients.find(client => client.userName === userName.value)

            function checkUserNameStorage(login) {
                if (login.value === '' || !isUserName) {
                    login.nextElementSibling.nextElementSibling.style.display = 'block';
                    login.style.borderBottom = '1px solid red';

                    return false;
                }

                login.nextElementSibling.nextElementSibling.style.display = 'none';
                login.style.borderBottom = '1px solid green';

                return true;
            }

            function checkPasswordStorage(pass) {
                if (pass.value === '' || !isSignInUser) {
                    pass.nextElementSibling.nextElementSibling.style.display = 'block';
                    pass.style.borderBottom = '1px solid red';

                    return false;
                }

                pass.nextElementSibling.nextElementSibling.style.display = 'none';
                pass.style.borderBottom = '1px solid #C6C6C4';
                return true;
            }

            const checkUserName = checkUserNameStorage(userName);
            const checkPassword = checkPasswordStorage(password);

            if (!checkUserName || !checkPassword) {
                return false;
            } else {

                mainTitle.textContent = `Welcome ${isSignInUser.fullName}`;
                btnSing.textContent = 'Exit';

                mainSubTitle.remove();
                links.remove()

                formRemove.forEach(item => {
                    item.remove()
                })

                btnSing.addEventListener('click', e => {
                    e.preventDefault()
                    location.reload()
                })

                return resetFrom.reset();
            }
        })
    })

    form.forEach(item => {
        item.addEventListener('submit', function (e) {
            e.preventDefault();

            let hasError = false

            const isCheckName = checkFullName(fullName)

            !isCheckName ? hasError = true : false


            const isCheckLogin = checkUserName(userName);

            !isCheckLogin ? hasError = true : false


            const isCheckEmail = checkEmail(email);

            !isCheckEmail ? hasError = true : false


            const isCheckPass = createPass(password)

            !isCheckPass ? hasError = true : false


            const isCheckPass2 = checkPassword(password, confirmPassword)

            !isCheckPass2 ? hasError = true : false

            if (!checkbox.checked) {
                errorText.style.color = 'red'
            } else {
                errorText.style.color = '#636363'
            }

            const isCheckUser = clients.some(client => client.email === email.value || client.userName === userName.value)

            if (isCheckUser) {
                popupCheck.style.display = "block";
                document.body.style.overflow = "hidden";
                resetFrom.reset();

                Ok.addEventListener('click', () => {
                    popupCheck.style.display = "none";
                    document.body.style.overflow = "";
                })

                popupCheck.addEventListener('click', (e) => {
                    if (e.target === popupCheck) {
                        popupCheck.style.display = "none";
                        document.body.style.overflow = "";
                    }
                })

                btn.forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault()
                        formControl.forEach(item => {
                            item.remove()
                        })
                        links.textContent = 'Registration'
                        mainTitle.textContent = 'Log in to the system';
                        btnSing.textContent = 'Sign In';

                        links.style.cssText = `
                        display: block;
                        width: 210px;
                        transform: translateX(-8.5%);
                        padding: 10px;
                        border-radius: 40px;
                        background: #DD3142;
                        text-align: center;
                        color: #FFF;
                        border: none;
                        font-size: 20px;
                    `;

                        links.addEventListener('click', e => {
                            e.preventDefault()
                            location.reload()
                        })


                        btnSing.addEventListener('click', (e) => {
                            e.preventDefault()
                            const isSignInUser = clients.find(client => client.userName === userName.value && client.password === password.value);
                            const isUserName = clients.find(client => client.userName === userName.value)

                            function checkUserNameStorage(login) {
                                if (login.value === '' || !isUserName) {
                                    login.nextElementSibling.nextElementSibling.style.display = 'block';
                                    login.style.borderBottom = '1px solid red';

                                    return false;
                                }

                                login.nextElementSibling.nextElementSibling.style.display = 'none';
                                login.style.borderBottom = '1px solid green';

                                return true;
                            }

                            function checkPasswordStorage(pass) {
                                if (pass.value === '' || !isSignInUser) {
                                    pass.nextElementSibling.nextElementSibling.style.display = 'block';
                                    pass.style.borderBottom = '1px solid red';

                                    return false;
                                }

                                pass.nextElementSibling.nextElementSibling.style.display = 'none';
                                pass.style.borderBottom = '1px solid #C6C6C4';
                                return true;
                            }

                            const checkUserName = checkUserNameStorage(userName);
                            const checkPassword = checkPasswordStorage(password);

                            if (!checkUserName || !checkPassword) {
                                return false;
                            } else {

                                mainTitle.textContent = `Welcome ${isSignInUser.fullName}`;
                                btnSing.textContent = 'Exit';

                                mainSubTitle.remove();
                                links.remove()

                                formRemove.forEach(item => {
                                    item.remove()
                                })

                                btnSing.addEventListener('click', e => {
                                    e.preventDefault()
                                    location.reload()
                                })

                                return resetFrom.reset();
                            }
                        })
                    })
                })

            } else {
                if (!hasError) {
                    if (!checkbox.checked) {
                        errorText.style.color = 'red'
                        return
                    } else {
                        const newClient = {
                            fullName: fullName.value,
                            userName: userName.value,
                            email: email.value,
                            password: password.value,
                            confirmPassword: confirmPassword.value,
                        }

                        clients.push(newClient);
                        localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))

                        errorText.style.color = '#636363'
                        popup.style.display = "block"
                        document.body.style.overflow = "hidden"
                        resetFrom.reset()
                    }

                    closeOk.addEventListener('click', () => {
                        popup.style.display = "none"
                        document.body.style.overflow = ""
                    })

                    popup.addEventListener('click', (e) => {
                        if (e.target === popup) {
                            popup.style.display = "none"
                            document.body.style.overflow = ""
                        }
                    })

                    btn.forEach(item => {
                        item.addEventListener('click', (e) => {
                            e.preventDefault()

                            formControl.forEach(item => {
                                item.remove()
                            })

                            links.textContent = 'Registration'
                            mainTitle.textContent = 'Log in to the system'
                            btnSing.textContent = 'Sign In'

                            links.style.cssText = `
                                                    display: block;
                                                    width: 210px;
                                                    transform: translateX(-8.5%);
                                                    padding: 10px;
                                                    border-radius: 40px;
                                                    background: #DD3142;
                                                    text-align: center;
                                                    color: #FFF;
                                                    border: none;
                                                    font-size: 20px;
                                                `
                            links.addEventListener('click', e => {
                                e.preventDefault()
                                location.reload()
                            })

                            btnSing.addEventListener('click', (e) => {
                                e.preventDefault()
                                const isSignInUser = clients.find(client => client.userName === userName.value && client.password === password.value);
                                const isUserName = clients.find(client => client.userName === userName.value)

                                function checkUserNameStorage(login) {
                                    if (login.value === '' || !isUserName) {
                                        login.nextElementSibling.nextElementSibling.style.display = 'block';
                                        login.style.borderBottom = '1px solid red';

                                        return false;
                                    }

                                    login.nextElementSibling.nextElementSibling.style.display = 'none';
                                    login.style.borderBottom = '1px solid green';

                                    return true;
                                }

                                function checkPasswordStorage(pass) {
                                    if (pass.value === '' || !isSignInUser) {
                                        pass.nextElementSibling.nextElementSibling.style.display = 'block';
                                        pass.style.borderBottom = '1px solid red';

                                        return false;
                                    }

                                    pass.nextElementSibling.nextElementSibling.style.display = 'none';
                                    pass.style.borderBottom = '1px solid #C6C6C4';
                                    return true;
                                }

                                const checkUserName = checkUserNameStorage(userName);
                                const checkPassword = checkPasswordStorage(password);

                                if (!checkUserName || !checkPassword) {
                                    return false;
                                } else {

                                    mainTitle.textContent = `Welcome ${isSignInUser.fullName}`;
                                    btnSing.textContent = 'Exit';

                                    mainSubTitle.remove();
                                    links.remove()

                                    formRemove.forEach(item => {
                                        item.remove()
                                    })

                                    btnSing.addEventListener('click', e => {
                                        e.preventDefault()
                                        location.reload()
                                    })

                                    return resetFrom.reset();
                                }
                            })
                        })
                    })
                }
            }
        });
    })
})

