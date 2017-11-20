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

// Defines a Mocha test suite to group tests of similar kind together
suite("Sum Sequence tests", () => {
    test("Sum decimals", () => {
        assert.equal(0, myExtension.sumSequence([], 10))
        assert.equal(true, isNaN(myExtension.sumSequence([""], 10)))
        assert.equal(1, myExtension.sumSequence(["1"], 10))
        assert.equal(6, myExtension.sumSequence(["1", "2", "3"], 10))
        assert.equal(6, myExtension.sumSequence(["1    ", " 2 ", "   3"], 10))
        assert.equal(13, myExtension.sumSequence(["1", "2", "10"], 10))
        assert.equal(true, isNaN(myExtension.sumSequence(["1", "2", "af"], 10)))       
    })
    
    test("Sum hexadecimals", () => {
        assert.equal(0, myExtension.sumSequence([], 16))
        assert.equal(true, isNaN(myExtension.sumSequence([""], 16)))
        assert.equal(1, myExtension.sumSequence(["1"], 16))
        assert.equal(6, myExtension.sumSequence(["1", "2", "3"], 16))
        assert.equal(19, myExtension.sumSequence(["1", "2", "10"], 16))
        assert.equal(178, myExtension.sumSequence(["1", "2", "af"], 16))        
    })

    test("Sum binary", () => {
        assert.equal(0, myExtension.sumSequence([], 2))
        assert.equal(true, isNaN(myExtension.sumSequence([""], 2)))
        assert.equal(1, myExtension.sumSequence(["1"], 2))
        assert.equal(true, isNaN(myExtension.sumSequence(["1", "2", "3"], 2)))
        assert.equal(3, myExtension.sumSequence(["1", "0", "10"], 2))        
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
        assert.deepStrictEqual(["  0", " 10", "200"], myExtension.numbersToString([0, 10, 200], 10, true, true))  
        assert.deepStrictEqual(["0b00", "0b10", "0b11"], myExtension.numbersToString([0, 2, 3], 2, true, true))
        assert.deepStrictEqual(["0x00", "0x0A", "0x64"], myExtension.numbersToString([0, 10, 100], 16, true, true))
        assert.deepStrictEqual(["0", "10", "200"], myExtension.numbersToString([0, 10, 200], 10, false, true))  
        assert.deepStrictEqual(["0b0", "0b10", "0b11"], myExtension.numbersToString([0, 2, 3], 2, false, true))
        assert.deepStrictEqual(["0x0", "0xA", "0x64"], myExtension.numbersToString([0, 10, 100], 16, false, true))   
    })
})