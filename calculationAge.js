const MILLISECONDS_PER_SECOND = 1000;

function calculationAge(birthdayDate) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    const birthday = new Date(birthdayDate * MILLISECONDS_PER_SECOND);
    
    const birthdayDay = birthday.getDate();
    const birthdayMonth = birthday.getMonth();
    const birthdayYear = birthday.getFullYear();

    const customerAge = currentYear > birthdayYear ? currentYear - birthdayYear : 0;

    const monthDifference = birthdayMonth > currentMonth; // разница в месяцах
    const dayDifference = birthdayDay > currentDay; // разница в днях

    if ((monthDifference || dayDifference) && customerAge !== 0) {
        return customerAge - 1;
    }

    return customerAge;
};

module.exports = {
	calculationAge,
};