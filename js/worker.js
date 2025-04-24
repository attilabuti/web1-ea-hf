onmessage = e => {
    console.log('Üzenet a html5.js-ből: ', e.data);

    console.log('Üzenet visszaküldése a html5.js-nek')
    postMessage('Hello, World!');
};
