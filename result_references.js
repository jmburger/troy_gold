/*
We allow prepaid debit card users to load money onto their card directly via a cash deposit. Users need to use their card 
number as a reference. This mechanism works as long as a card can be uniquely identified.
Human error sometimes comes into play, if one or more digits is inadvertently dropped. In some cases, the bank also 
abbreviates card numbers by replacing multiples of a particular digit with a letter.
Below, "references" contains a sample of references for cash payments and "cardNumbers" contains the card numbers on our 
system. Write a function that extracts the relevant part of a reference and determines whether it matches a card number 
unambiguously. For each reference, give a "match" status of "unique", "multiple" or "none".
You will be able to determine the value of some of the substitutions according to this particular list of card numbers, 
but you should regard this as an arbitrary subset of all numbers and thus not make any assumptions based on it alone. Instead, 
determine a match status if all you know is that a certain character needs to be replaced.
(The actual card numbers have been obfuscated for security reasons, of course.)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

'use strict';

// Sample of cash deposit references
const references = [
'CASH DEP SANDRIDGE ( 49,48 ) DEPOSIT NO : 0132540003715129 CONTACT',
'CASH DEP GROBLERSDA( 7,06 ) DEPOSIT NO : 013254@3715186 CONTACT',
'CASH DEP BRITS ONE ( 10,09 ) DEPOSIT NO : 01325400037152 CONTACT',
'CASH DEP THOHOYANDO( 46,45 ) DEPOSIT NO : 013254@371P41 CONTACT',
'CASH DEP NEWTOWN JU( 40,39 ) DEPOSIT NO : 013254@03715P5 CONTACT',
'CASH DEP PORT ELIZA( 36,35 ) DEPOSIT NO : 013254@3715G2 CONTACT',
'CASH DEP BRAKPAN 1 ( 6,55 ) DEPOSIT NO : 0132540003710138 CONTACT'
];

// function to remove ref account number from referances:
function find_acc_num(req) {
    var arr = [];
    var i = 0;
    for (i=0; i<req.length; i++){
        var start = req[i].indexOf("DEPOSIT NO :")
        var end = req[i].indexOf("CONTACT")
        var accNum = req[i].slice(start, end).replace("DEPOSIT NO :", "").trim()
        arr.push(accNum)
    }
    return arr
}

var refAccNum = find_acc_num(references);

// Our card numbers
const cardNumbers = [
'0132540003715053',
'0132540003715061',
'0132540003715079',
'0132540003715087',
'0132540003715095',
'0132540003715103',
'0132540003715111',
'0132540003715129',
'0132540003715137',
'0132540003715145',
'0132540003715152',
'0132540003715160',
'0132540003715178',
'0132540003715186',
'0132540003715194',
'0132540003715202',
'0132540003715210',
'0132540003715228',
'0132540003715236',
'0132540003715244',
'0132540003715251',
'0132540003715269',
'0132540003715277',
'0132540003715285',
'0132540003715293',
'0132540003715301',
'0132540003715319',
'0132540003715327',
'0132540003715335',
'0132540003715343',
'0132540003715350',
'0132540003715368',
'0132540003715376',
'0132540003715384',
'0132540003715392',
'0132540003715400',
'0132540003715418',
'0132540003715426',
'0132540003715434',
'0132540003715442',
'0132540003715509',
'0132540003715517',
'0132540003715525',
'0132540003715533',
'0132540003715541',
'0132540003713341',
'0132540003715558',
'0132540003715566',
'0132540003715574',
'0132540003715582',
'0132540003715590'
];

function check_letters(refAccNum, cardNumb) {
    var result = [];
    var x, j, i, y = 0;
    for (x=0; x<refAccNum.length; x++) {
        var count = 0;
        var resultStr = '';
        var refNum = refAccNum[x];
        for (j=0; j<cardNumb.length; j++) {  //loop through card numbers
            var cardNum = cardNumb[j];
            var refCount = refAccNum[x].length-1;
            var letterStr = '';
            var prevLet = '';
            for (i=15; i>=0; i--) { //loop backwards the length of a card number
                if (/^[0-9]$/.test(refNum[refCount])) { //if digit else letter
                    if (refNum[refCount] != cardNum[i]) { //check if ref num matches card num
                        break;
                    }
                } else { 
                    for (y=0; y<5; y++) { //loop through to find similar numbers in a row to link to a letter
                        if (cardNum[i-y] != cardNum[i-(y+1)]){ // if prev number is not equal
                            if (y > 0) {  //if double, triple, .., number is found that can be linked to a letter
                                if (prevLet != refNum[refCount]){ 
                                    letterStr += refNum[refCount] + ': ' + (y+1) + 'x' + cardNum[i] + ' ';
                                    prevLet = refNum[refCount];
                                }
                                refCount++;
                            }
                            break;
                        }
                    }
                }
                refCount--;
            }
            if (i == -1) { // if unique solution is found 
                resultStr += cardNum + ' ' + letterStr + ' ';
                count++; // increment number of possible solution
            }
        }
        var status = '';
        if (count == 0) {
            status = 'none'; 
        } else if (count == 1) {
            status = 'unique';
        } else if (count > 1) {
            status = 'multi';
        }
        result.push('Deposit No:' + refNum + '\tStatus: ' + status + '\tCard Number: ' + resultStr);
    }
    return result    
}

var result = check_letters(refAccNum, cardNumbers);
var i = 0;
for (i=0; i<result.length; i++) { 
    console.log(result[i])
}
