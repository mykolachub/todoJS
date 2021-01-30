'use strict';

const staticCasheName = 'static-v1.1.02';

const staticAssets = [
    './',
    './index.html',

    './dist/app.js',
    './dist/autosize.min.js',
    './dist/main.ce10d63be0d6f4973ea5.js', // настраиваемый

    './manifest.json',

    './src/styles/index.css',
    './src/styles/settings.css',
    './src/styles/header.css',
    './src/styles/sheet.css',
    './src/styles/list.css',
    './src/styles/modal.css',

    './src/icons/todo.png',
    './src/icons/bin.png',
    './src/icons/search.png',
    './src/icons/lightmode.png',
    './src/icons/archive.png',
    './src/icons/clue.png',
    './src/icons/darkmode.png',
    './src/icons/ok.png',
    './src/icons/warning.png',

    './src/icons/favicons/favicon.ico',

    './src/icons/logo/icon-192x192.png',
    './src/icons/logo/icon-256x256.png',
    './src/icons/logo/icon-384x384.png',
    './src/icons/logo/maskable_icon_x1.png',

    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
    'https://fonts.gstatic.com/s/inter/v3/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7W0Q5n-wU.woff2',
    'https://fonts.gstatic.com/s/inter/v3/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2',
];

self.addEventListener('install', async e => {
    console.log('Service Worker Has Been Installed');
    const cashe = await caches.open(staticCasheName)
    await cashe.addAll(staticAssets);
});

self.addEventListener('activate', async e => {
    console.log('Service Worker Has Been Activated');
    const cashesKeys = await caches.keys();
    const checkKeys = cashesKeys.map(async key => {
        if (staticCasheName !== key) {
            await caches.delete(key);
        }
    });
    await Promise.all(checkKeys);
});

self.addEventListener('fetch', event => {
    // console.log(`Trying to fetch ${event.request.url}`);
    event.respondWith(caches.match(event.request).then(cashedResponse => {
        return cashedResponse || fetch(event.request);
    }))
});