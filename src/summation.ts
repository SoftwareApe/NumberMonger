import * as editorIO from './editorIO';
import * as convert from './convert';
import * as vscode from 'vscode';

export function sumSequenceFloat() : void {
    printSum(sumSequence(editorIO.getSelectedTexts(), 0));
}

export function sumSequenceDec() : void {
    printSum(sumSequence(editorIO.getSelectedTexts(), 10));
}

export function sumSequenceHex() : void {
    printSum(sumSequence(editorIO.getSelectedTexts(), 16));
}

export function sumSequenceBin() : void {
    printSum(sumSequence(editorIO.getSelectedTexts(), 2));
}

function printSum(sum : number) : void {
    // Check if this is a sequence of numbers
    let isNumber = !isNaN(sum);

    // Display a message box to the user
    let displayText = isNumber ? 'Sum of sequence: ' + sum : 'Error: Couldn\'t parse numbers in sequence.';
    vscode.window.showInformationMessage(displayText);
}

function textSelectionToNumbers(textSelections : string[], base : number) : number[] {
    // function for summing up the numbers in a single selection
    let regex = convert.getRegex(base);
    function sumSingle(text : string) : number[] {
        let matches : string[] = [];
        let found : RegExpExecArray;
        while (found = regex.exec(text)) {
            // first group is the sign, second group is the number, in case there are prefixes in between
            let m = found[1] + found[2];
            matches.push(m);
        }
        // base 0 is chosen for floating point
        let parser = v => base === 0 ? parseFloat(v) : parseInt(v, base);
        let ret = matches.map(v => parser(v));
        return ret;
    }

    let ret = textSelections.map(sumSingle).reduce((a, b) => a.concat(b), []);

    return ret;
}

export function sumSequence(textSelections : string[], base : number) : number {
    // sum up over the sums of the individual selections
    let sum = textSelectionToNumbers(textSelections, base).reduce((a, b) => a + b, 0);

    return sum;
}
