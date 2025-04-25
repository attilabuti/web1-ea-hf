const AURL = 'http://gamf.nhely.hu/ajax2/';
const AKEY = 'w31m7n9j3d';

async function apiHandler(data) {
    data = {
        code: AKEY,
        ...data,
    };

    try {
        const response = await fetch(AURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(data).toString(),
        });

        if (!response.ok) {
            console.error(`Response status: ${response.status}`);

            return null;
        }

        const json = await response.json();

        return json;
    } catch (e) {
        console.error(e.message);

        return null;
    }
}

async function read() {
    let result = await apiHandler({
        op: 'read',
    });

    if (result !== undefined && result !== null && Object.prototype.toString.call(result) === '[object Object]') {
        if (result.list !== undefined && result.list.length > 0) {
            return result.list;
        }
    }

    return null;
}

async function readId(id) {
    let result = await read();

    if (result !== null) {
        return Object.values(result).find(item => item.id == id) || null;
    }

    return null;
}

async function create(name, height, weight) {
    let result = await apiHandler({ op: 'create', name, height, weight });

    if (result !== undefined && result !== null && result == 1) {
        return true;
    }

    return false;
}

async function update(id, name, height, weight) {
    let result = await apiHandler({ op: 'update', id, name, height, weight });

    if (result !== undefined && result !== null && result == 1) {
        return true;
    }

    return false;
}

async function remove(id) {
    let result = await apiHandler({ op: 'delete', id });

    if (result !== undefined && result !== null && result == 1) {
        return true;
    }

    return false;
}

function parseNumber(value) {
    if (value === undefined || value === null) {
        return null;
    }

    value = value.toString();

    value = value.replace(/[^0-9.,]/g, '');
    if (value.length == 0) {
        return null;
    }

    if (value.includes('.') || value.includes(',')) {
        value = value.replace(/,/g, '.');

        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    } else {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    }
}

const dataTable = document.getElementById('data-list');
const statSum = document.querySelector('.stat-sum');
const statAvg = document.querySelector('.stat-avg');
const statMax = document.querySelector('.stat-max');

function drawTable(data) {
    dataTable.innerHTML = '';
    statSum.textContent = '';
    statAvg.textContent = '';
    statMax.textContent = '';

    if (data === undefined || data === null || data.length == 0) {
        return;
    }

    let scount = 0;
    let ssum = 0;
    let sall = [];
    data.forEach(e => {
        let parsedHeight = parseNumber(e.height);
        if (parsedHeight !== null) {
            scount++;
            ssum += parsedHeight;
            sall.push(parsedHeight);
        }

        var tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.height}</td>
            <td>${e.weight}</td>
        `;

        dataTable.appendChild(tr);
    });

    let savg = 0;
    if (scount > 0) {
        savg = ssum / scount;
    }

    let smax = Math.max(...sall);

    statSum.textContent = ssum;
    statAvg.textContent = savg.toFixed(2);
    statMax.textContent = smax == -Infinity ? 0 : smax;
}

function getStringValue(did) {
    let value = document.getElementById(did).value;

    if (value.length === 0) {
        return { error: 'Please enter a value.', value: '' };
    }

    if (value.length > 30) {
        return { error: 'Must be 30 characters or fewer.', value: '' };
    }

    return { error: null, value };
}

function getNumericValue(did) {
    let value = document.getElementById(did).value.trim();

    if (value.length === 0) {
        return { error: 'Please enter a value.', value: '' };
    }

    if (value.length > 30) {
        return { error: 'Must be 30 characters or fewer.', value: '' };
    }

    const cleaned = value.replace(/[^0-9.,]/g, '');
    if (cleaned !== value) {
        return { error: 'Only numbers are allowed.', value: '' };
    }

    value = cleaned.replace(',', '.');

    return { error: null, value };
}

function getIntValue(did) {
    let value = document.getElementById(did).value.trim();

    if (value.length === 0) {
        return { error: 'Please enter a value.', value: '' };
    }

    if (value.length > 30) {
        return { error: 'Must be 30 characters or fewer.', value: '' };
    }

    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned !== value) {
        return { error: 'Only numbers are allowed.', value: '' };
    }

    value = cleaned.replace(',', '.');

    return { error: null, value };
}

function showErrorMessage(did, errorMsg) {
    const input = document.getElementById(did);

    if (!input) {
        return;
    }

    const label = input.closest('div')?.querySelector(`label[for="${did}"]`);
    const span = label?.querySelector('.msg');

    if (span) {
        span.textContent = errorMsg;
    }
}

function removeErrorMessage(did) {
    const input = document.getElementById(did);

    if (!input) return;

    const label = input.closest('div')?.querySelector(`label[for="${did}"]`);
    const span = label?.querySelector('.msg');

    if (span) {
        span.textContent = '';
    }
}

function resetFields(fields) {
    for (let i = 0; i < fields.length; i++) {
        removeErrorMessage(fields[i]);
        document.getElementById(fields[i]).value = '';
    }
}

function enableDisableInput(enabled, fields) {
    for (let i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).disabled = enabled;
    }
}

var createMsgEl = document.querySelector('.create-msg');
var udpateMsgEl = document.querySelector('.update-msg');
var deleteMsgEl = document.querySelector('.delete-msg');

function resetUpdate(keepMsg) {
    resetFields(['load-id', 'u-name', 'u-height', 'u-weight']);

    if (!keepMsg) {
        udpateMsgEl.classList.remove('error', 'success');
        udpateMsgEl.textContent = '';
    }

    enableDisableInput(true, ['u-name', 'u-height', 'u-weight', 'update-reset-btn', 'update-btn']);
    enableDisableInput(false, ['load-id', 'load-reset-btn', 'load-btn']);
}

document.addEventListener('DOMContentLoaded', () => {
    read().then(data => {
        drawTable(data);
    });

    document.getElementById('reload-btn').addEventListener('click', () => {
        dataTable.innerHTML = '';
        statSum.textContent = '';
        statAvg.textContent = '';
        statMax.textContent = '';

        read().then(data => {
            drawTable(data);
        });
    });

    document.getElementById('create-btn').addEventListener('click',() => {
        let name = getStringValue('c-name');
        if (name.error !== null) {
            showErrorMessage('c-name', name.error);
            return;
        } else {
            removeErrorMessage('c-name');
        }

        let height = getNumericValue('c-height');
        if (height.error !== null) {
            showErrorMessage('c-height', height.error);
            return;
        } else {
            removeErrorMessage('c-height');
        }

        let weight = getNumericValue('c-weight');
        if (weight.error !== null) {
            showErrorMessage('c-weight', weight.error);
            return;
        } else {
            removeErrorMessage('c-weight');
        }

        create(name.value, height.value, weight.value).then(result => {
            createMsgEl.classList.remove('error', 'success');
            createMsgEl.textContent = '';

            if (result) {
                createMsgEl.classList.add('success');
                createMsgEl.textContent = 'Item created successfully.';
                resetFields(['c-name', 'c-height', 'c-weight']);
            } else {
                createMsgEl.classList.add('error');
                createMsgEl.textContent = 'Something went wrong. Please try again.';
            }
        });
    });

    document.getElementById('create-reset-btn').addEventListener('click',() => {
        resetFields(['c-name', 'c-height', 'c-weight']);
        createMsgEl.classList.remove('error', 'success');
        createMsgEl.textContent = '';
    });

    document.getElementById('load-btn').addEventListener('click',() => {
        let itemId = getIntValue('load-id');
        if (itemId.error !== null) {
            showErrorMessage('load-id', itemId.error);
            return;
        } else {
            removeErrorMessage('load-id');
        }

        readId(itemId.value).then(result => {
            udpateMsgEl.classList.remove('error', 'success');
            udpateMsgEl.textContent = '';

            if (result !== null) {
                udpateMsgEl.classList.add('success');
                udpateMsgEl.textContent = 'The element has been successfully loaded.';

                document.getElementById('u-name').value = result.name;
                document.getElementById('u-height').value = result.height;
                document.getElementById('u-weight').value = result.weight;

                enableDisableInput(false, ['u-name', 'u-height', 'u-weight', 'update-reset-btn', 'update-btn']);
                enableDisableInput(true, ['load-id', 'load-reset-btn', 'load-btn']);
            } else {
                udpateMsgEl.classList.add('error');
                udpateMsgEl.textContent = 'No element found with the given ID.';
            }
        });
    });

    document.getElementById('load-reset-btn').addEventListener('click',() => {
        resetUpdate();
    });

    document.getElementById('update-btn').addEventListener('click',() => {
        let name = getStringValue('u-name');
        if (name.error !== null) {
            showErrorMessage('u-name', name.error);
            return;
        } else {
            removeErrorMessage('u-name');
        }

        let height = getNumericValue('u-height');
        if (height.error !== null) {
            showErrorMessage('u-height', height.error);
            return;
        } else {
            removeErrorMessage('u-height');
        }

        let weight = getNumericValue('u-weight');
        if (weight.error !== null) {
            showErrorMessage('u-weight', weight.error);
            return;
        } else {
            removeErrorMessage('u-weight');
        }

        let itemId = getIntValue('load-id');
        update(itemId.value, name.value, height.value, weight.value).then(result => {
            udpateMsgEl.classList.remove('error', 'success');
            udpateMsgEl.textContent = '';

            if (result) {
                udpateMsgEl.classList.add('success');
                udpateMsgEl.textContent = 'Item updated successfully.';
                resetUpdate(true);
            } else {
                udpateMsgEl.classList.add('error');
                udpateMsgEl.textContent = 'Something went wrong. Please try again.';
            }
        });
    });

    document.getElementById('update-reset-btn').addEventListener('click', () => {
        resetUpdate();
    });

    document.getElementById('delete-btn').addEventListener('click', () => {
        let itemId = getIntValue('delete-id');
        if (itemId.error !== null) {
            showErrorMessage('delete-id', itemId.error);
            return;
        } else {
            removeErrorMessage('delete-id');
        }

        remove(itemId.value).then(result => {
            deleteMsgEl.classList.remove('error', 'success');
            deleteMsgEl.textContent = '';

            if (result) {
                deleteMsgEl.classList.add('success');
                deleteMsgEl.textContent = 'The element has been successfully deleted.';
                resetFields(['delete-id']);
            } else {
                deleteMsgEl.classList.add('error');
                deleteMsgEl.textContent = 'No element found with the given ID.';
            }
        });
    });

    document.getElementById('delete-reset-btn').addEventListener('click', () => {
        deleteMsgEl.classList.remove('error', 'success');
        deleteMsgEl.textContent = '';
        resetFields(['delete-id']);
    });
});
