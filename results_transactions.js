/*
We distribute prepaid debit cards that users can manage on our platform. Users can 
load money onto their card by making a payment on our platform. We then use an 
external service provided by a bank to load it on the card.
To find out what transactions were made using a card and to update the data on our side, 
we also need to use the external service. We are here only concerned with money spent with 
the card, not what was loaded onto it. The problem is, when we query a card, both successful 
and unsuccessful transactions are returned, without an indication of their status 
(this is actually happening, I didn't make it up). The only clue given by the bank is the 
total amount of all successful transactions with card. We have to fit the data to determine 
which transactions were successful. Every time we make an update, we take the latest status 
on our side as accurate and only consider new transactions.
Below, "internal" represents the successful transactions up to time === 7. We need to update 
our data and "external1" and "external2" represent 2 possible scenarios encountered when 
updating the card transactions on our side. Notice that in each scenario there are transactions 
from time <= 7 that we've already excluded, because the amounts adding up to 434 at time === 7 
are 80, 67, 252, 35. So, in scenario 1, we excluded 124 and 125 and in scenario 2 we 
excluded 212 and 256. The only relevant new transactions, therefore, are from time > 7.
Write a function to determine which transactions fit the data and to update our internal copy 
accordingly. You can start with the simpler scenario 1, but the end result needs to be generic, 
so that it can work with either (or any other) case.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

'use strict';

// Our Copy
let internal = {
  totalAmount: 434,
  transactions: [
    { time: 1, amount: 80 },
    { time: 3, amount: 67 },
    { time: 3, amount: 252 },
    { time: 7, amount: 35 }
  ]
};

// Scenario 1
const external1 = {
  totalAmount: 735,
  transactions: [
    { time: 1, amount: 80 },
    { time: 1, amount: 124 },
    { time: 3, amount: 67 },
    { time: 3, amount: 252 },
    { time: 5, amount: 125 },
    { time: 7, amount: 35 },
    { time: 8, amount: 170 },
    { time: 9, amount: 97 },
    { time: 11, amount: 25 },
    { time: 12, amount: 106 }
  ]
};

// Scenario 2
const external2 = {
  totalAmount: 1111,
  transactions: [
    { time: 1, amount: 80 },
    { time: 2, amount: 212 },
    { time: 3, amount: 67 },
    { time: 3, amount: 252 },
    { time: 4, amount: 256 },
    { time: 7, amount: 35 },
    { time: 17, amount: 92 },
    { time: 22, amount: 255 },
    { time: 23, amount: 67 },
    { time: 28, amount: 97 },
    { time: 28, amount: 50 },
    { time: 39, amount: 253 },
    { time: 41, amount: 110 },
    { time: 47, amount: 54 },
    { time: 49, amount: 146 },
    { time: 56, amount: 35 }
  ]
};

function findTransactions(external, totalAmount, partialSum) {
    var sum, n, remaining;
  
    partialSum = partialSum || [];
  
    sum = partialSum.reduce(function (num1, num2) { // sum partial
        return num1 + num2;
    }, 0); 

    if (sum == totalAmount) { // if the partial sum is equals to totalAmount
        console.log("Transaction amounts: %s", partialSum.join(", "))
    }
    if (sum > totalAmount) { // if we reach the number or exceed return 
        return;  
    }
  
    for (var i = 0; i < external.length; i++) {
        n = external[i].amount;
        remaining = external.slice(i + 1);
        findTransactions(remaining, totalAmount, partialSum.concat([n]));
    }
}
  
// findTransactions(external1.transactions, external1.totalAmount);

function findExternal(internal, external) {
    var remaining, lastTime, amount;
    
    // find totatl amount:
    amount = external.totalAmount - internal.totalAmount; 
    // find relavent transactions:
    lastTime = internal.transactions[internal.transactions.length-1].time;   
    for (var i = 0; i < external.transactions.length; i++) {
        if (external.transactions[i].time > lastTime){
            break;
        }
        remaining = external.transactions.slice(i + 1);
    }
    findTransactions(remaining, amount)

}

findExternal(internal, external1)
