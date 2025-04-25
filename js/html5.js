// Web Storage - LocalStorage
let wsSavedData = false;

function wsSave() {
    let inputData = document.getElementById('data').value;
    localStorage.setItem('userinput', inputData);

    document.getElementById('output').textContent = 'Adat elmentve';
    wsSavedData = true;
}

function wsLoad() {
    let savedInput = localStorage.getItem('userinput');
    document.getElementById('output').textContent = savedInput != null ? 'Betöltött adat: ' + savedInput : 'Nincs mentett adat.';
}

function wsRemove() {
    localStorage.removeItem('userinput');
    document.getElementById('output').textContent = wsSavedData ? 'A mentett adat törölve lett' : 'Nincs mentett adat.';
    wsSavedData = false;
}

// Web Worker
var worker;
var wwStatusEl = document.getElementById('ww-status');

function startWorker() {
    if (typeof(Worker) !== 'undefined') {
        if (typeof(worker) == 'undefined') {
            worker = new Worker('js/worker.js');
            worker.onmessage = e => {
                document.getElementById('workerOutput').textContent = 'worker.js üzenete: ' + e.data;
            };

            wwStatusEl.innerText = 'Elindítva';
        } else {
            alert('A Web Worker már el lett indítva!');
        }
    } else {
        alert('Ez a böngésző nem támogatja a Web Worker-t.');
    }
}

function stopWorker() {
    if (typeof(worker) != 'undefined') {
        worker.terminate();
        worker = undefined;
        wwStatusEl.innerText = 'Leállítva';
    } else {
        alert('A Web Worker még nem került elindításra!');
    }
}

function sendMessage() {
    if (typeof(worker) != 'undefined') {
        console.log('Üzenet küldése a worker.js-nek')
        worker.postMessage('Hello!');
    } else {
        alert('Először el kell indítani a Web Worker-t!');
    }
}

// Server-Sent Events
const eventSource = new EventSource('https://sse.dev/test');

var messageCounter = 0;
var messagesEl = document.getElementById('messages');

eventSource.onmessage = e => {
    if (messageCounter > 5) {
        messagesEl.textContent = '';
        messageCounter = 0;
    }

    let data = JSON.parse(e.data);

    let newMessage = document.createElement('p');
    newMessage.textContent = `${data.msg} | ${data.now}`;
    messagesEl.appendChild(newMessage);

    messageCounter++;
};

eventSource.onerror = () => {
    let errorMsg = document.createElement('p');
    errorMsg.style.color = 'red';
    errorMsg.style.fontWeight = 700;
    errorMsg.textContent = `Hiba történt a kapcsolat során.`;
    messagesEl.appendChild(errorMsg);
};

// Geolocation API
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, getPositionError);
    } else {
        document.getElementById('location').style.color = 'red';
        document.getElementById('location').style.fontWeight = 700;
        document.getElementById('location').textContent = `A böngésző nem támogatja a geolokációt.`;
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('location').textContent = `Latitude: ${lat}, Longitude: ${lon}`;
}

function getPositionError(err) {
    document.getElementById('location').style.color = 'red';
    document.getElementById('location').style.fontWeight = 700;
    document.getElementById('location').textContent = err.message;
}

// Drag and Drop API
function dragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

function dragOver(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    ev.target.appendChild(document.getElementById(data));
}

// Canvas
function drawOnCanvas() {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');

    var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, 'blue');
    grd.addColorStop(1, 'white');

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 200, 100);
}
