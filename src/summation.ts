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


export function sumSequence(textSelections : string[], base : number) : number {
    // function for summing up the numbers in a single selection
    let regex = convert.getRegex(base);
    if (base === 0) console.log('regex = ' + regex);
    function sumSingle(text : string) : number {
        let matches : string[] = [];
        let found : RegExpExecArray;
        if (base === 0) console.log('Applying regex to...' + text);
        while (found = regex.exec(text)) {
            // first group is the sign, second group is the number, in case there are prefixes in between
            let m = found[1] + found[2];
            matches.push(m);
            if (base === 0) console.log('matched ' + m);
        }
        if (base === 0) console.log('number of matches ' + matches.length);
        // base 0 is chosen for floating point
        let parser = v => base === 0 ? parseFloat(v) : parseInt(v, base);
        let sum = matches.map(v => parser(v)).reduce((a, b) => a + b, 0);
        if (base === 0) console.log('sum = ' + sum + '\n');
        return sum;
    }

    // sum up over the sums of the individual selections
    let sum = textSelections.map(sumSingle).reduce((a, b) => a + b, 0);

    return sum;
}
