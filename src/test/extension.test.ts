//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
import * as myExtension from '../extension'
import * as convert from '../convert'

// Defines a Mocha test suite to group tests of similar kind together
suite("Sum Sequence tests", () => {
    test("Sum decimals", () => {
        assert.equal(0, myExtension.sumSequence([], 10))
        assert.equal(0, myExtension.sumSequence([""], 10))
        assert.equal(1, myExtension.sumSequence(["1"], 10))
        assert.equal(6, myExtension.sumSequence(["1", "2", "3"], 10))
        assert.equal(6, myExtension.sumSequence(["1    ", " 2 ", "   3"], 10))
        assert.equal(13, myExtension.sumSequence(["1", "2", "10"], 10))
        assert.equal(9, myExtension.sumSequence(["1", "-2", "10"], 10))
        assert.equal(3, myExtension.sumSequence(["1", "2", "af"], 10))
        assert.equal(45, myExtension.sumSequence(["{1, 2, 3}", "{4, 5, 6}", "{7, 8, 9}"], 10))       
    })
    
    test("Sum hexadecimals", () => {
        assert.equal(0, myExtension.sumSequence([], 16))
        assert.equal(0, myExtension.sumSequence([""], 16))
        assert.equal(1, myExtension.sumSequence(["1"], 16))
        assert.equal(6, myExtension.sumSequence(["1", "2", "3"], 16))
        assert.equal(17, myExtension.sumSequence(["-1", "2", "10"], 16))
        assert.equal(178, myExtension.sumSequence(["1", "2", "af"], 16))        
        assert.equal(-172, myExtension.sumSequence(["0x1", "0x2", "-0xaf"], 16))
        assert.equal(5, myExtension.sumSequence(["{0x1, 0x2, 0x3}", "{0x4, 0x5, 0x6}", "{-0x10, 0x0, 0x0}"], 16))              
    })

    test("Sum binary", () => {
        assert.equal(0, myExtension.sumSequence([], 2))
        assert.equal(0, myExtension.sumSequence([""], 2))
        assert.equal(1, myExtension.sumSequence(["1"], 2))
        assert.equal(1, myExtension.sumSequence(["1", "2", "3"], 2))
        assert.equal(-1, myExtension.sumSequence(["1", "0", "-10"], 2))        
        assert.equal(1, myExtension.sumSequence(["-0b1", "0b0", "0b10"], 2))    
        assert.equal(20, myExtension.sumSequence(["{0b1, 0b10, 0b11}", "{0b100, 0b101, 0b110}", "{-0b1, 0x0, 0x0}"], 2))       
    })

})

suite("Create Sequence tests", () => {
    test("Create number sequence", () => {    
        assert.deepStrictEqual([], myExtension.createSequence(2, 0, 10))    
        assert.deepStrictEqual([2], myExtension.createSequence(2, 1, 10))    
        assert.deepStrictEqual([0, 1, 2], myExtension.createSequence(0, 3, 1))    
        assert.deepStrictEqual([0, 4, 8], myExtension.createSequence(0, 3, 4))    
        assert.deepStrictEqual([1, 5, 9], myExtension.createSequence(1, 3, 4))    
        assert.deepStrictEqual([0, -4, -8], myExtension.createSequence(0, 3, -4))    
        assert.deepStrictEqual([12, 8, 4, 0, -4, -8, -12], myExtension.createSequence(12, 7, -4))    
    })

    test("Convert sequences to string", () => {    
        assert.deepStrictEqual([], myExtension.numbersToString([], 10, false, false))  
        assert.deepStrictEqual(["0", "1", "2"], myExtension.numbersToString([0, 1, 2], 10, false, false))  
        assert.deepStrictEqual(["0", "10", "100"], myExtension.numbersToString([0, 10, 100], 10, false, false))  
        assert.deepStrictEqual(["-3", "0", "3"], myExtension.numbersToString([-3, 0, 3], 10, false, false))  
        assert.deepStrictEqual(["0", "A", "64"], myExtension.numbersToString([0, 10, 100], 16, false, false))  
        assert.deepStrictEqual(["0", "10", "11"], myExtension.numbersToString([0, 2, 3], 2, false, false))  
        assert.deepStrictEqual([" 0", "10", "11"], myExtension.numbersToString([0, 2, 3], 2, true, false))
        assert.deepStrictEqual(["000", "010", "200"], myExtension.numbersToString([0, 10, 200], 10, true, true))  
        assert.deepStrictEqual(["00", "10", "11"], myExtension.numbersToString([0, 2, 3], 2, true, true))
        assert.deepStrictEqual(["00", "0A", "64"], myExtension.numbersToString([0, 10, 100], 16, true, true))
        assert.deepStrictEqual(["000", "010", "200"], myExtension.numbersToString([0, 10, 200], 10, false, true))  
        assert.deepStrictEqual(["00", "10", "11"], myExtension.numbersToString([0, 2, 3], 2, false, true))
        assert.deepStrictEqual(["00", "0A", "64"], myExtension.numbersToString([0, 10, 100], 16, false, true))
        assert.deepStrictEqual(["00", "-0A", "-64"], myExtension.numbersToString([0, -10, -100], 16, false, true))   
        assert.deepStrictEqual([" 00", "-0A", "-64"], myExtension.numbersToString([0, -10, -100], 16, true, true))   
    })

    test("Base to base conversion", () => {
        assert.equal("", convert.convertStringBaseToBase("", 10, 16, true))
        assert.equal("0x1", convert.convertStringBaseToBase("1", 10, 16, true))
        assert.equal("0xA", convert.convertStringBaseToBase("10", 10, 16, true))
        assert.equal("[0xAu]", convert.convertStringBaseToBase("[10u]", 10, 16, true))
        assert.equal("[255u]", convert.convertStringBaseToBase("[0xFFu]", 16, 10, true))
        assert.equal("[255u, 16u]", convert.convertStringBaseToBase("[0xFFu, 0x10u]", 16, 10, true))
        assert.equal("{5, 2}", convert.convertStringBaseToBase("{0b101, 10}", 2, 10, true))
        assert.equal("{-0b101, 0b10}", convert.convertStringBaseToBase("{-5, 2}", 10, 2, true))
        assert.equal("16", convert.convertStringBaseToBase("16", 2, 10, true)) //no conversion if it doesn't make sense
    })
})