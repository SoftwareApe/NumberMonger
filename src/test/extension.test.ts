//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https:// mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../extension';
import * as convert from '../convert';
import * as sequences from '../sequences';
import * as summation from '../summation';

// Defines a Mocha test suite to group tests of similar kind together
suite('Sum Sequence tests', () => {
    test('Sum floats', () => {
        assert.equal(0, summation.sumSequence([], 0)[0]);
        assert.equal(0, summation.sumSequence([''], 0)[0]);
        assert.equal(1, summation.sumSequence(['1.'], 0)[0]);
        assert.equal(6, summation.sumSequence(['1.0', '2.0', '3.0'], 0)[0]);
        assert.equal(1.5, summation.sumSequence(['1e0    ', ' 2e-1 ', '  .3'], 0)[0]);
        assert.equal(121, summation.sumSequence(['1e+0', '2.E+1', '10e1'], 0)[0]);
        assert.equal(10.8, summation.sumSequence(['1', '-.2', '10'], 0)[0]);
        assert.equal(3, summation.sumSequence(['1', '2', 'af'], 0)[0]);
        assert.equal(40.230000000000004, summation.sumSequence(['{1.0, 0.2, 0.03}', '{4, 5, 6}', '{7, 8, 9}'], 0)[0]); // floating point rounding error, but ok
    });

    test('Sum decimals', () => {
        assert.equal(0, summation.sumSequence([], 10)[0]);
        assert.equal(0, summation.sumSequence([''], 10)[0]);
        assert.equal(1, summation.sumSequence(['1'], 10)[0]);
        assert.equal(6, summation.sumSequence(['1', '2', '3'], 10)[0]);
        assert.equal(6, summation.sumSequence(['1    ', ' 2 ', '   3'], 10)[0]);
        assert.equal(13, summation.sumSequence(['1', '2', '10'], 10)[0]);
        assert.equal(9, summation.sumSequence(['1', '-2', '10'], 10)[0]);
        assert.equal(3, summation.sumSequence(['1', '2', 'af'], 10)[0]);
        assert.equal(45, summation.sumSequence(['{1, 2, 3}', '{4, 5, 6}', '{7, 8, 9}'], 10)[0]);
    });

    test('Sum hexadecimals', () => {
        assert.equal(0, summation.sumSequence([], 16)[0]);
        assert.equal(0, summation.sumSequence([''], 16)[0]);
        assert.equal(1, summation.sumSequence(['1'], 16)[0]);
        assert.equal(6, summation.sumSequence(['1', '2', '3'], 16)[0]);
        assert.equal(17, summation.sumSequence(['-1', '2', '10'], 16)[0]);
        assert.equal(178, summation.sumSequence(['1', '2', 'af'], 16)[0]);
        assert.equal(-172, summation.sumSequence(['0x1', '0x2', '-0xaf'], 16)[0]);
        assert.equal(5, summation.sumSequence(['{0x1, 0x2, 0x3}', '{0x4, 0x5, 0x6}', '{-0x10, 0x0, 0x0}'], 16)[0]);
    });

    test('Sum binary', () => {
        assert.equal(0, summation.sumSequence([], 2)[0]);
        assert.equal(0, summation.sumSequence([''], 2)[0]);
        assert.equal(1, summation.sumSequence(['1'], 2)[0]);
        assert.equal(1, summation.sumSequence(['1', '2', '3'], 2)[0]);
        assert.equal(-1, summation.sumSequence(['1', '0', '-10'], 2)[0]);
        assert.equal(1, summation.sumSequence(['-0b1', '0b0', '0b10'], 2)[0]);
        assert.equal(20, summation.sumSequence(['{0b1, 0b10, 0b11}', '{0b100, 0b101, 0b110}', '{-0b1, 0x0, 0x0}'], 2)[0]);
    });

    test('Mean', () => {
        assert.equal(0, summation.sumSequence([], 0)[1]);
        assert.equal(0, summation.sumSequence([''], 0)[1]);
        assert.equal(1, summation.sumSequence(['1.'], 0)[1]);
        assert.equal(2, summation.sumSequence(['1.0', '2.0', '3.0'], 0)[1]);
        assert.equal(0.5, summation.sumSequence(['1e0    ', ' 2e-1 ', '  .3'], 0)[1]);
        assert.equal(40.3333333333333333333333333333, summation.sumSequence(['1e+0', '2.E+1', '10e1'], 0)[1]);
        assert.equal(3.6, summation.sumSequence(['1', '-.2', '10'], 0)[1]);
        assert.equal(1.5, summation.sumSequence(['1', '2', 'af'], 0)[1]);
        assert.equal(40.230000000000004 / 9.0, summation.sumSequence(['{1.0, 0.2, 0.03}', '{4, 5, 6}', '{7, 8, 9}'], 0)[1]); // floating point rounding error, but ok
    });

    test('Standard deviation', () => {
        assert.equal(0, summation.sumSequence([], 0)[2]);
        assert.equal(0, summation.sumSequence([''], 0)[2]);
        assert.equal(0, summation.sumSequence(['1.'], 0)[2]);
        assert.equal(Math.sqrt(2.0 / 3.0), summation.sumSequence(['1.0', '2.0', '3.0'], 0)[2]);
        assert.equal(Math.sqrt((0.5 * 0.5 + 0.3 * 0.3 + 0.2 * 0.2) / 3.0), summation.sumSequence(['1e0    ', ' 2e-1 ', '  .3'], 0)[2]);
    });

    test('Median', () => {
        assert.equal(0, summation.sumSequence([], 0)[3]);
        assert.equal(0, summation.sumSequence([''], 0)[3]);
        assert.equal(1.0, summation.sumSequence(['1.'], 0)[3]);
        assert.equal(2.0, summation.sumSequence(['1.0', '2.0', '3.0'], 0)[3]);
        assert.equal(0.3, summation.sumSequence(['1e0    ', ' 2e-1 ', '  .3'], 0)[3]);
        assert.equal(0.3, summation.sumSequence(['1e0    ', ' 2e-1 ', '  .3', '0.3'], 0)[3]);
        assert.equal(0.6, summation.sumSequence(['1e0    ', ' 2e-1 '], 0)[3]);
        assert.equal(7, summation.sumSequence(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], 0)[3]);
    });
});

suite('Create Sequence tests', () => {
    test('Create number sequence', () => {
        assert.deepStrictEqual([], sequences.createSequence(2, 0, 10));
        assert.deepStrictEqual([2], sequences.createSequence(2, 1, 10));
        assert.deepStrictEqual([0, 1, 2], sequences.createSequence(0, 3, 1));
        assert.deepStrictEqual([0, 4, 8], sequences.createSequence(0, 3, 4));
        assert.deepStrictEqual([1, 5, 9], sequences.createSequence(1, 3, 4));
        assert.deepStrictEqual([0, -4, -8], sequences.createSequence(0, 3, -4));
        assert.deepStrictEqual([12, 8, 4, 0, -4, -8, -12], sequences.createSequence(12, 7, -4));
    });

    test('Display sequences as string, dec', () => {
        assert.deepStrictEqual([], sequences.numbersToString([], 10, false, false));
        assert.deepStrictEqual(['0', '1', '2'], sequences.numbersToString([0, 1, 2], 10, false, false));
        assert.deepStrictEqual(['0', '10', '100'], sequences.numbersToString([0, 10, 100], 10, false, false));
        assert.deepStrictEqual(['-3', '0', '3'], sequences.numbersToString([-3, 0, 3], 10, false, false));
        assert.deepStrictEqual(['000', '010', '200'], sequences.numbersToString([0, 10, 200], 10, true, true));
        assert.deepStrictEqual(['000', '010', '200'], sequences.numbersToString([0, 10, 200], 10, false, true));
    });

    test('Display sequences as string, hex', () => {
        assert.deepStrictEqual(['00', '0A', '64'], sequences.numbersToString([0, 10, 100], 16, true, true));
        assert.deepStrictEqual(['0', 'A', '64'], sequences.numbersToString([0, 10, 100], 16, false, false));
        assert.deepStrictEqual(['00', '0A', '64'], sequences.numbersToString([0, 10, 100], 16, false, true));
        assert.deepStrictEqual(['00', '-0A', '-64'], sequences.numbersToString([0, -10, -100], 16, false, true));
        assert.deepStrictEqual([' 00', '-0A', '-64'], sequences.numbersToString([0, -10, -100], 16, true, true));
    });

    test('Display sequences as string, bin', () => {
        assert.deepStrictEqual(['0', '10', '11'], sequences.numbersToString([0, 2, 3], 2, false, false));
        assert.deepStrictEqual([' 0', '10', '11'], sequences.numbersToString([0, 2, 3], 2, true, false));
        assert.deepStrictEqual(['00', '10', '11'], sequences.numbersToString([0, 2, 3], 2, true, true));
        assert.deepStrictEqual(['00', '10', '11'], sequences.numbersToString([0, 2, 3], 2, false, true));
    });
});

suite('Number conversion tests', () => {
    test('Base to base conversion, dec -> hex', () => {
        assert.equal('', convert.convertStringBaseToBase('', 10, 16, true));
        assert.equal('0x1', convert.convertStringBaseToBase('1', 10, 16, true));
        assert.equal('0xA', convert.convertStringBaseToBase('10', 10, 16, true));
        assert.equal('[0xAu]', convert.convertStringBaseToBase('[10u]', 10, 16, true));
    });

    test('Base to base conversion, hex -> dec', () => {
        assert.equal('[255u]', convert.convertStringBaseToBase('[0xFFu]', 16, 10, true));
        assert.equal('[255u, 16u]', convert.convertStringBaseToBase('[0xFFu, 0x10u]', 16, 10, true));
    });

    test('Base to base conversion, bin -> dec', () => {
        assert.equal('{5, 2}', convert.convertStringBaseToBase('{0b101, 10}', 2, 10, true));
        assert.equal('16', convert.convertStringBaseToBase('16', 2, 10, true)); // no conversion if it doesn't make sense
    });

    test('Base to base conversion, bin -> dec', () => {
        assert.equal('{-0b101, 0b10}', convert.convertStringBaseToBase('{-5, 2}', 10, 2, true));
    });
});
