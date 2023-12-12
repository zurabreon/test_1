const fs = require("fs");

const MILLISECONDS_PER_SECOND = 1000;

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();

let customerAge = 0;

function calculationAge(birthdayDate) {
    
    const birthday = new Date(birthdayDate * MILLISECONDS_PER_SECOND);
    
    const birthdayDay = birthday.getDate();
    const birthdayMonth = birthday.getMonth();
    const birthdayYear = birthday.getFullYear();

    if (currentYear - birthdayYear > 0) {
        customerAge = currentYear - birthdayYear;
    }
    else {
        customerAge = 0;
    }

    if (((birthdayDay - currentDay <= 0 && birthdayMonth - currentMonth === 0) || (birthdayDay - currentDay === 0 && birthdayMonth - currentMonth <= 0)) && currentYear - birthdayYear >= 0) {
        customerAge++;
    }

    return customerAge;
};

module.exports = {
	calculationAge,
};