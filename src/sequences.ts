import * as vscode from 'vscode';
import * as editorIO from './editorIO';

import leftPad = require('left-pad');
import sprintfJs = require('sprintf-js');

export function createSequenceDec() : void {
    createSequenceAny(10);
}

export function createSequenceHex() : void {
    createSequenceAny(16);
}

export function createSequenceBin() : void {
    createSequenceAny(2);
}

export function createRandomSequenceDec() : void {
    createRandomSequenceAny(10);
}

export function createRandomSequenceHex() : void {
    createRandomSequenceAny(16);
}

export function createRandomSequenceBin() : void {
    createRandomSequenceAny(2);
}

/* get the precision used on a floating point number, e.g. 0.3 is 1, 1 is 0*/
export function getFloatingPointPrecision(f : number) : number {
    /* display as string */
    let decimals : string = f.toString();

    /* count the number of decimal places */
    let decimalIndex : number = decimals.indexOf('.');
    if (decimalIndex < 0) { // no decimal index found
        return 0;
    }
    else {
        let precision : number = decimals.length - (decimalIndex + 1);
        return precision;
    }
}

function createSequenceAny(base : number) : void {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor => do nothing
    }

    editorIO.promptUserInteger('Sequence start (0)', 0, start => {
        editorIO.promptUserInteger('Sequence step size (1)', 1, stepSize => {
            editorIO.promptUserYesNo('Right align? (n)', false, isRightAligned => {
                editorIO.promptUserYesNo('Zero pad? (n)', false, isZeroPadded => {
                        let selections = editor.selections;
                        let nValues = selections.length;
                        let sequence = createSequence(start, nValues, stepSize);
                        let output = numbersToString(sequence, base, isRightAligned, isZeroPadded);

                        editorIO.replaceSelections(editor, selections, output);
                });
            });
        });
    });
}

function createRandomSequenceAny(base : number) : void {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor => do nothing
    }

    editorIO.promptUserInteger('Min (0) [int]', 0, min => {
        editorIO.promptUserInteger('Max (4294967295) [int]', 4294967295, max => {
            editorIO.promptUserYesNo('Right align? (n)', false, isRightAligned => {
                editorIO.promptUserYesNo('Zero pad? (n)', false, isZeroPadded => {
                        let selections = editor.selections;
                        let nValues = selections.length;
                        let sequence = createRandomSequence(min, max, nValues);
                        let output = numbersToString(sequence, base, isRightAligned, isZeroPadded);

                        editorIO.replaceSelections(editor, selections, output);
                });
            });
        });
    });
}

export function createSequenceFloat() : void {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor => do nothing
    }

    let base = 10;
    editorIO.promptUserFloat('Sequence start (0.0)', 0.0, start => {
        editorIO.promptUserFloat('Sequence step size (1.0)', 1.0, stepSize => {
            let selections = editor.selections;
            let nValues = selections.length;
            let sequence = createSequence(start, nValues, stepSize);
            let output = numbersToString(sequence, base, false, false);

            editorIO.replaceSelections(editor, selections, output);
        });
    });
}

export function createRandomSequenceFloat() : void {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor => do nothing
    }

    let base = 10;
    editorIO.promptUserFloat('Min (0.0) [float]', 0.0, min => {
        editorIO.promptUserFloat('Max (1.0) [float]', 1.0, max => {
            let selections = editor.selections;
            let nValues = selections.length;
            let sequence = createRandomFloatSequence(min, max, nValues);
            let output = numbersToString(sequence, base, false, false);

            editorIO.replaceSelections(editor, selections, output);
        });
    });
}


export function createSequence(start : number, nValues : number, stepSize : number) : number[] {
    let seq = [];
    let precision : number = getFloatingPointPrecision(stepSize);

    for (let i = 0; i < nValues; ++i) {
        seq.push((start + i * stepSize).toFixed(precision));
    }

    return seq;
}

export function createRandomSequence(min : number, max : number, nValues : number) : number[] {
    let seq = [];

    for (let i = 0; i < nValues; ++i) {
        seq.push(getRandomInt(min, max));
    }

    return seq;
}

export function createRandomFloatSequence(min : number, max : number, nValues : number) : number[] {
    let seq = [];

    for (let i = 0; i < nValues; ++i) {
        seq.push(getRandomFloat(min, max));
    }

    return seq;
}

function getRandomInt(min : number, max : number) : number
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min : number, max : number) : number
{
    return Math.random() * (max - min) + min;
}

export function numbersToString(numbers : number[], base : number, isRightAligned : boolean, isZeroPadded : boolean) : string[] {
    // separate signs and string representation
    let strings = numbers.map(n => Math.abs(n).toString(base).toUpperCase());
    let signs = numbers.map(n => n < 0 ? '-' : '');

    let formatString : string = '%s%s';
    if (isZeroPadded) {
        let maxAbsLength = strings.map(s => s.length).reduce((a, b) => Math.max(a, b), 0);
        formatString = '%s%0' + maxAbsLength + 's';
    }

    strings = strings.map((s, i) => sprintfJs.sprintf(formatString, signs[i], s));

    // right align
    if (isRightAligned) {
        let maxLength = strings.map(s => s.length).reduce((a, b) => Math.max(a, b), 0);
        strings = strings.map(s => leftPad(s, maxLength));
    }

    return strings;
}
