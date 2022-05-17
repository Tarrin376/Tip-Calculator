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
    
    if (isNaN(customTip.value) || customTip.value >= 100) {
        changeOutline(customTip, null, false);
        return;
    }

    if (customTip.value !== '') changeOutline(customTip, null);
    else customTip.style.outline = 'none';
    updateTotal();
});

resetBtn.addEventListener('click', () => {
    if (resetBtn.className !== 'disabled') {
        customTip.style.outline = billInput.style.outline = peopleInput.style.outline = '';
        totalText.textContent = tipText.textContent = '0.00';
        customTip.value = totalBill.value = people.value = '';
        modifyResetButton(true);
        resetTip();
    }
});

const modifyResetButton = (isDisabled) => {
    if (isDisabled) resetBtn.className = 'disabled';
    else resetBtn.className = 'enabled';
};

modifyResetButton(true);
const resetTip = () => {
    if (prevBtn === null) return;
    prevBtn.style.background = '';
    prevBtn.style.color = '';
};

tipButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const btnTarget = e.currentTarget;
        btnTarget.style.background = 'hsl(172, 67%, 45%)';
        btnTarget.style.color = 'hsl(183, 100%, 15%)';
        customTip.value = customTip.style.outline = '';
        resetTip();

        if (btnTarget === prevBtn) {
            totalText.textContent = totalText.textContent - tipText.textContent;
            tipText.textContent = '0.00';
            prevBtn = null;
        }
        else {
            prevBtn = btnTarget;
        }

        updateTotal();
    });
});

const changeOutline = (e, text, valid = true) => {
    if (valid === false) e.style.outline = '2px solid orange';
    else e.style.outline = '2px solid hsl(172, 67%, 45%)';
    return valid;
};

function updateTotal() {
    const numPeople = parseInt(people.value);
    const billSum = parseFloat(totalBill.value);
    const val = totalBill.value;
    const last = val.length - 1;

    if (checkInputs(numPeople, billSum)) {
        let sum = billSum / numPeople;
        let custom = customTip.value;
        let tip = (prevBtn !== null) ? sum * prevBtn.value : custom === '' ? 0 : custom / numPeople;
        
        totalText.textContent = (sum + tip).toFixed(2);
        tipText.textContent = (tip).toFixed(2);
        modifyResetButton(false);
    }
    else {
        totalText.textContent = tipText.textContent = '0.00';
        modifyResetButton(true);
    }
    
    totalBill.value = isNaN(billSum) ? '' : (val[last] == '.' && val[last - 1] != '.') ? val : billSum;
    people.value = isNaN(numPeople) ? '' : numPeople;
}

function checkInputs(numPeople, billSum) {
    const billError = document.getElementById('billError');
    const pplError = document.getElementById('pplError');
    let valid = true;

    if (!isNaN(billSum) && billSum > 0 && billSum < 1000) changeOutline(billInput, billError);
    else valid = changeOutline(billInput, billError, false);
    
    if (!isNaN(numPeople) && numPeople > 0 && numPeople < 100) changeOutline(peopleInput, pplError);
    else valid = changeOutline(peopleInput, pplError, false);
    return valid;
}