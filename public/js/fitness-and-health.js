 window.addEventListener("load", solve);

 function solve(){
    const usernameTag = document.querySelector('#username');
    const userInfo = document.querySelector('.profile-hidden-info');

    usernameTag.addEventListener('mouseenter', e => {

        userInfo.style.display = 'flex';
    });

    userInfo.addEventListener('mouseenter', e => {
        userInfo.style.display = 'flex';
    });

    userInfo.addEventListener('mouseleave', e => {

        userInfo.style.display = 'none';
    });
 }