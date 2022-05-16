const [totalBill, people] = [document.getElementById('totalBill'), document.getElementById('people')];
const [billInput, peopleInput] = [document.querySelector('.billInput'), document.querySelector('.peopleInput')];
const tipButtons = [...document.querySelector('.tipAmount').getElementsByTagName('button')];
const totalText = document.getElementById('totalAmount').children[1];
const tipText = document.getElementById('tipTotal').children[1];
const customTip = document.getElementById('customTip');
const resetBtn = document.getElementById('reset');
let prevBtn = null;

totalBill.addEventListener('keyup', updateTotal);
people.addEventListener('keyup', updateTotal);

customTip.addEventListener('keyup', () => {
    resetTip();
    prevBtn = null;
    
    if (isNaN(customTip.value)) {
        changeOutline(customTip, null, false);
        return;
    }

    changeOutline(customTip, null);
    updateTotal();
});

resetBtn.addEventListener('click', () => {
    if (resetBtn.className !== 'disabled') {
        customTip.style.outline = '';
        billInput.style.outline = '';
        peopleInput.style.outline = '';
        totalText.textContent = '0';
        tipText.textContent = '0';
        customTip.value = '';
        totalBill.value = '';
        people.value = '';
        resetTip();
    }
});

const modifyResetButton = (isDisabled) => {
    if (isDisabled) resetBtn.className = 'disabled';
    else resetBtn.className = 'enabled';
};

modifyResetButton(true);
tipButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const btnTarget = e.currentTarget;
        btnTarget.style.background = 'hsl(172, 67%, 45%)';
        btnTarget.style.color = 'hsl(183, 100%, 15%)';
        customTip.value = '';
        customTip.style.outline = '';
        resetTip();

        if (btnTarget === prevBtn) {
            totalText.textContent = totalText.textContent - tipText.textContent;
            tipText.textContent = '0';
            prevBtn = null;
        }
        else {
            prevBtn = btnTarget;
        }

        updateTotal();
    });
});

const changeOutline = (e, text, valid = true) => {
    if (valid === false) {
        e.style.outline = '2px solid orange';
        if (text != null) text.style.visibility = 'visible';
    }
    else {
        e.style.outline = '2px solid hsl(172, 67%, 45%)';
        if (text != null) text.style.visibility = 'hidden';
    }

    return valid;
};

function resetTip() {
    if (prevBtn !== null) {
        prevBtn.style.background = '';
        prevBtn.style.color = '';
    }
}

function updateTotal() {
    const numPeople = parseInt(people.value);
    const billSum = parseFloat(totalBill.value);
    const val = totalBill.value;
    const last = val.length - 1;

    if (checkInputs(numPeople, billSum)) {
        let sum = billSum / numPeople;
        let custom = customTip.value;
        let tip = (prevBtn !== null) ? sum * prevBtn.value : custom === '' ? 0 : custom / numPeople;
        totalText.textContent = sum + tip;
        tipText.textContent = tip;
        modifyResetButton(false);
    }
    else {
        totalText.textContent = '0';
        tipText.textContent = '0';
        modifyResetButton(true);
    }
    
    totalBill.value = isNaN(billSum) ? '' : (val[last] == '.' && val[last - 1] != '.') ? val : billSum;
    people.value = isNaN(numPeople) ? '' : numPeople;
}

function checkInputs(numPeople, billSum) {
    const billError = document.getElementById('billError');
    const pplError = document.getElementById('pplError');
    let valid = true;

    if (!isNaN(billSum) && billSum > 0) changeOutline(billInput, billError);
    else valid = changeOutline(billInput, billError, false);
    
    if (!isNaN(numPeople) && numPeople > 0) changeOutline(peopleInput, pplError);
    else valid = changeOutline(peopleInput, pplError, false);
    return valid;
}