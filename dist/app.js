'use strict';

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceworker.js')
            .then(registration => {
                console.log('Service Worker Refistered', registration);
            })
            .catch(error => {
                console.log('Registration Failed', error);
            });
    }
});