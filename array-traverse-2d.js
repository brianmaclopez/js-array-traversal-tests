/* 
 * Program takes accepts a command line argument for the size of the 
 *   arrays.
 * If size is not passed as argument then 4 is default and the arrays will
 *   logged to console to check the algorithms do what they are supposed to
 * The following functions traverse the arrays and change the values
 *   from 0 to 1
 * 
 * OBSERVED
 *  With recurseTraverse SIZE is limited by the array initializations on lines 20 & 21
 *  With iterativeTraverse SIZE is limited by iterativeTraverse
 */

const fs = require('fs');
const { exit, argv } = require('process');

const SIZE = Number(argv[2]) || 4;
console.log('Array size is ' + SIZE + ' * ' + SIZE + '\n');
const x = SIZE, y = SIZE, v = 0; // Keep approaching max
const arr = [...Array(x)].fill(Array(y).fill(v));
const arr1 = [...Array(x)].fill(Array(y).fill(v));


function recurseTraverse(arr) {
    // Works even when depth is unkown
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        if (!Array.isArray(arr[i])) {
            arr[i] = 1;
        } else {
            return recurseTraverse(arr[i]);
        }
    }
}

function iterativeTraverse(arr) {
    // Must know depth
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            arr[i][j] = 1;
        }
    }
}

if (SIZE === 4) {
    console.log('TEST ARRAYS PRE-OP');
    console.dir(arr);
    console.dir(arr1);   
    console.log('\n')
} 

// Log performance
const at0 = performance.now();
recurseTraverse(arr);
const at1 = performance.now();
console.log(`Call to recurseTraverse took ${at1 - at0} milliseconds.`);

const bt0 = performance.now();
iterativeTraverse(arr1);
const bt1 = performance.now();
console.log(`Call to iterativeTraverse took ${bt1 - bt0} milliseconds.`);

if (SIZE === 4) {
    console.log('\nTEST ARRAYS POST-OP');
    console.dir(arr);
    console.dir(arr1);   
}

// Save results in filesystem

// OPTIONAL export as CSV
// const csvLine = `${SIZE},${at1 - at0}ms,${bt1 - bt0}ms`
// fs.appendFile('arrayTraversalResults.csv'
//     , csvLine
//     , function (err) {
//         if (err) throw err;
//         console.log('Updated!');
//   });

// JSON output
fs.readFile(
    // If file does not exist writefile will create one
    'results.js', 
    'utf8', 
    (err, data) => {
    if (err) { 
        if (err.code !== 'ENOENT') {
            console.error(err.code);
            exit(1);  
        } 
    };

    let json = JSON.parse(data || '[]'); // '[]' handles empty data
    const obj = {size: SIZE, recursive: `${at1 - at0}`, iterative: `${bt1 - bt0}`};
    json.push(obj);

    fs.writeFile('results.js', JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('Results updated!');
    });    
});

// 65535000 runs out of heap memory

// At size 9999
//  Call to recurseTraverse took 2.388296961784363 milliseconds.
//  Call to iterativeTraverse took 152.3016989827156 milliseconds.

// At size 999950
//  Call to recurseTraverse took 3.200309991836548 milliseconds.
//  Iterative breaks

// At size 29999999

// At SIZE = 30000000

// At const SIZE = 35000000

// At SIZE = 37500000
