const [totalBill, people] = [document.getElementById('totalBill'), document.getElementById('people')];
const totalText = document.getElementById('totalAmount').children[1];
const tipText = document.getElementById('tipTotal').children[1];
const tipButtons = [...document.querySelector('.tipAmount').getElementsByTagName('button')];
let prevButton = null;

totalBill.addEventListener('keyup', updateTotal);
people.addEventListener('keyup', updateTotal);

const roundNumber = (number) => {
    let round = (Math.floor((number + Number.EPSILON) * 100) / 100).toString();
    let index = round.indexOf('.');
    if (index !== -1) round += '0'.repeat(2 - (round.length - index) + 1);
    else round += `.00`;
    return round;
};

tipButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const btnTarget = e.currentTarget;
        btnTarget.style.background = 'hsl(172, 67%, 45%)';
        btnTarget.style.color = 'hsl(183, 100%, 15%)';

        if (prevButton !== null) {
            prevButton.style.background = '';
            prevButton.style.color = '';
        }
        
        if (btnTarget === prevButton) {
            prevButton = null;
            totalText.textContent = roundNumber(totalText.textContent - tipText.textContent);
            tipText.textContent = '0.00';
        }
        else {
            prevButton = btnTarget;
        }

        updateTotal();
    });
});

function updateTotal() {
    const numPeople = parseInt(people.value);
    const billSum = parseFloat(totalBill.value);

    if (checkInputs(numPeople, billSum) === true) {
        let sum = billSum / numPeople;
        let tip = (prevButton !== null) ? sum * prevButton.value : 0;
        totalText.textContent = roundNumber(sum + tip);
        tipText.textContent = roundNumber(tip);
    }
    else {
        totalText.textContent = '0.00';
    }
    
    const val = totalBill.value;
    let last = val.length - 1;
    totalBill.value = isNaN(billSum) ? '' : (val[last] == '.' && val[last - 1] != '.') ? val : billSum;
    people.value = isNaN(numPeople) ? '' : numPeople;
}

function checkInputs(numPeople, billSum) {
    const billInput = document.querySelector('.billInput');
    const peopleInput = document.querySelector('.peopleInput');
    let valid = true;

    const changeOutline = (e, valid = true) => {
        if (valid === false) e.style.outline = '2px solid orange';
        else e.style.outline = '2px solid hsl(172, 67%, 45%)';
        return valid;
    };

    if (isNaN(billSum) || billSum === 0) valid = changeOutline(billInput, false);
    else changeOutline(billInput);

    if (isNaN(numPeople) || numPeople === 0) valid = changeOutline(peopleInput, false);
    else changeOutline(peopleInput);
    return valid;
}