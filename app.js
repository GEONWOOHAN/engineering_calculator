const field = document.getElementById("field");
const addButton = document.getElementById("add");
const minusButton = document.getElementById("minus");
const multiplyButton = document.getElementById("multiply");
const divideButton = document.getElementById("divide");
const powerButton = document.getElementById("power");
const equalButton = document.getElementById("equalSign");
const formulaField = document.getElementById("formula");
const record = document.getElementById("record");
const deleteButton = document.getElementById("delete");
const recordClearButton = document.getElementById("recordClear");
const deleteAllButton = document.getElementById("deleteAll");
const leftParenthesisButton = document.getElementById("leftParenthesis");
const rightParenthesisButton = document.getElementById("rightParenthesis");
let countRightParenthesis = 0;

function calculator(operator, a, b) {
    if (operator == '+') {
        return Number(a) + Number(b);
    } else if (operator == '-') {
        return Number(a) - Number(b);
    } else if (operator == 'x') {
        return Number(a) * Number(b);
    } else if (operator == '/') {
        return Number(a) / Number(b);
    } else if (operator == '^') {
        return Number(a) ** Number(b);
    }
}

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

function leftParenthesisBtn(event) {
    event.preventDefault();
    if (isSymbol(field.value.slice(-1)) || field.value.slice(-1) == '(') {
        field.value += '(';
        countRightParenthesis += 1;
    } else {
        return;
    }

    field.focus();
}

function rightParenthesisBtn(event) {
    event.preventDefault();
    if (countRightParenthesis > 0) {
        if (!isSymbol(field.value.slice(-1)) || field.value.slice(-1) == ')') {
            field.value += ')';
            countRightParenthesis -= 1;
        } else {
            return;
        }
    }

    field.focus();
}

function deleteBtn(event) {
    event.preventDefault();
    if (field.value.slice(0, -1) == '') {
        field.value = "0";
    } else {
        field.value = field.value.slice(0, -1);
    }
}

function deleteAllBtn(event) {
    event.preventDefault();
    field.value = "0";
}

function equalSymbol(event) {
    event.preventDefault();
    let equation = field.value;
    if (isSymbol(equation.slice(-1))) {
        equation = equation.slice(0, -1);
    }
    let result = calculation(equation);
    formulaField.value = `ANS = ${result}`;
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
    let startIndex = '';
    let lastIndex = '';
    if (nums.length == 1) {
        result = equation;
    } else if (countRightParenthesis == 0 && equation.indexOf(')') != -1) {
        startIndex = equation.indexOf('(') + 1;
        lastIndex = equation.lastIndexOf(')');
        parenthesisEquation = equation.slice(startIndex, lastIndex);
        console.log(parenthesisEquation);
        result = equation.slice(0, startIndex - 1) + calculation(parenthesisEquation) + equation.slice(lastIndex, -1);
        console.log(result);
    } else {
        let a = '';
        let b = '';
        let operator = '';
        let multiplyAndDivide = symbols.filter((symbol) => symbol == 'x' || symbol == '/');
        for (i = 0; i < multiplyAndDivide.length; i++) {
            operator = multiplyAndDivide[i];
            a = nums[symbols.indexOf(multiplyAndDivide[i])];
            b = nums[symbols.indexOf(multiplyAndDivide[i]) + 1];
            nums.splice(symbols.indexOf(multiplyAndDivide[i]), 2);
            nums.splice(symbols.indexOf(multiplyAndDivide[i]), 0, (calculator(operator, a, b)).toString());
            symbols.splice(symbols.indexOf(multiplyAndDivide[i]), 1);
        }
        a = nums[0];
        for (i = 0; i < symbols.length; i++) {
            b = nums[i + 1];
            operator = symbols[i];
            a = calculator(operator, a, b);
        }
        result = Math.round(a * 10000) / 10000;
    }
    return result;
}

function keyControl(event) {
    const key = event.key;
    const keyCode = event.keyCode;

    if (keyCode == 32) {
        event.preventDefault();
    } else if (keyCode == 13) {
        event.preventDefault();
        equalButton.click();
    } else if (key == '(') {
        event.preventDefault();
        if (isSymbol(field.value.slice(-1)) || field.value.slice(-1) == '(') {
            field.value += '(';
            countRightParenthesis += 1;
        } else {
            return;
        }
    } else if (key == ')') {
        event.preventDefault();
        if (countRightParenthesis > 0) {
            if (!isSymbol(field.value.slice(-1)) || field.value.slice(-1) == ')') {
                field.value += ')';
                countRightParenthesis -= 1;
            } else {
                return;
            }
        }
    } else if (isSymbol(key)) {
        symbols(key);
        field.value = field.value.slice(0, -1);
        if (field.value == '') {
            event.preventDefault();
        }
    } else if (key == '*') {
        event.preventDefault();
        if (field.value.slice(-1) == '0' || field.value.slice(-1) == 'x') {
            return;
        } else {
            field.value += 'x';
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
leftParenthesisButton.addEventListener("click", leftParenthesisBtn);
rightParenthesisButton.addEventListener("click", rightParenthesisBtn);
deleteButton.addEventListener("click", deleteBtn);
deleteAllButton.addEventListener("click", deleteAllBtn);
recordClearButton.addEventListener("click", recordClear);