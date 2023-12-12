const calculationAge = require("../calculationAge");

const MILLISECONDS_PER_SECOND = 1000;


const firstTestAge = new Date(1954, 11, 4);
const secondTestAge = new Date(2999, 10, 4);
const thirdTestAge = new Date();
const fourthTestAge = new Date(1999, 7, 12);
const fifthTestAge = new Date(2000, 0, 1);

test ('Calculated age without errors', () => {
    expect(calculationAge.calculationAge(firstTestAge / MILLISECONDS_PER_SECOND)).toBe(70);
    expect(calculationAge.calculationAge(secondTestAge / MILLISECONDS_PER_SECOND)).toBe(0);
    expect(calculationAge.calculationAge(thirdTestAge / MILLISECONDS_PER_SECOND)).toBe(1);
    expect(calculationAge.calculationAge(fourthTestAge / MILLISECONDS_PER_SECOND)).toBe(25);
    expect(calculationAge.calculationAge(fifthTestAge / MILLISECONDS_PER_SECOND)).toBe(23);
});