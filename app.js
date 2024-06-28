const field = document.getElementById("field");
const addButton = document.getElementById("add");
const minusButton = document.getElementById("minus");
const multiplyButton = document.getElementById("multiply");
const divideButton = document.getElementById("divide");
const powerButton = document.getElementById("power");
const equalButton = document.getElementById("equalSign");
const formulaField = document.getElementById("formula");
const record = document.getElementById("record");
const recordClearButton = document.getElementById("recordClear");

const calculator = {
    add: function (a, b) {
        return a + b;
    },
    minus: function (a, b) {
        return a - b;
    },
    multiply: function (a, b) {
        return a * b;
    },
    divide: function (a, b) {
        return a / b;
    },
    power: function (a, b) {
        return a ** b;
    },
};

function isSymbol(symbol) {
    return ['+', '-', 'x', '/', '^'].includes(symbol);
}

function symbols(symbol) {
    const currentField = field.value;

    if (isSymbol(currentField.slice(-1))) {
        field.value = currentField.slice(0, -1) + symbol;
    } else if (currentField == '') {
        return;
    } else {
        field.value += symbol;
    }

    field.focus();
}

function addSymbol(event) {
    event.preventDefault();
    symbols('+');
}

function minusSymbol(event) {
    event.preventDefault();
    symbols('-');
}

function multiplySymbol(event) {
    event.preventDefault();
    symbols('x');
}

function divideSymbol(event) {
    event.preventDefault();
    symbols('/');
}

function powerSymbol(event) {
    event.preventDefault();
    symbols('^');
}

function equalSymbol(event) {
    event.preventDefault();
    let equation = field.value;
    let result = calculation(equation);
    formulaField.value = equation;
    field.value = result;
    calculationRecord(equation, result);
    field.focus();
}

function calculationRecord(equation, result) {
    const recordList = document.createElement("li");
    const recordText = document.createElement("h4");
    recordList.className = "recordList";
    localStorage.setItem(Date.now(), JSON.stringify([equation, result]));
    recordText.id = Date.now();
    recordText.innerHTML = `${equation} = ${result}`
    recordList.appendChild(recordText);
    record.appendChild(recordList);
    recordText.addEventListener("click", recordRecovery);
}

function recordClear(event) {
    event.preventDefault();
    localStorage.clear();
    const recordListAll = document.querySelectorAll("#record li");
    for (let i = 0; i < recordListAll.length; i++) {
        recordListAll[i].remove();
    }
    field.focus();
}

function recordRecovery(event) {
    event.preventDefault();
    const listSelected = event.target.id;
    formulaField.value = JSON.parse(localStorage.getItem(listSelected))[0];
    field.value = JSON.parse(localStorage.getItem(listSelected))[1];
}

function calculation(equation) {
    let nums = equation.match(/\d+/g);
    let symbols = equation.match(/\D+?/g);
    let result = '';
    if (nums.length == 1) {
        result = "0";
    } else {
        let a = parseInt(nums[0]);
        let b = parseInt(nums[1]);
    }
    return result;
}

function keyControl(event) {
    const key = event.key;
    const keyCode = event.keyCode;

    if (keyCode == 32) {
        event.preventDefault();
    } else if (isSymbol(key)) {
        symbols(key);
        field.value = field.value.slice(0, -1);
        if (field.value == '') {
            event.preventDefault();
        }
    } else if (!isNaN(key)) {
        if (field.value == '0') {
            field.value = field.value.slice(0, -1);
        } else {
            return;
        }
    } else if (keyCode == 8 || keyCode == 46) {
        if (field.value.slice(0, -1) == '') {
            event.preventDefault();
            field.value = "0";
        } else {
            return;
        }
    } else if (keyCode == 38 || keyCode == 40 || keyCode == 37 || keyCode == 39) {
        return;
    } else {
        event.preventDefault();
    }

    field.focus();
}


field.addEventListener("keydown", keyControl);
addButton.addEventListener("click", addSymbol);
minusButton.addEventListener("click", minusSymbol);
multiplyButton.addEventListener("click", multiplySymbol);
divideButton.addEventListener("click", divideSymbol);
powerButton.addEventListener("click", powerSymbol);
equalButton.addEventListener("click", equalSymbol);
recordClearButton.addEventListener("click", recordClear);