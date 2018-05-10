import * as editorIO from './editorIO';
import * as convert from './convert';
import * as vscode from 'vscode';

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
    function sumSingle(text : string) : number {
        let matches : string[] = [];
        let found : RegExpExecArray;
        while (found = regex.exec(text)) {
            // first group is the sign, second group is the number, in case there are prefixes in between
            matches.push(found[1] + found[2]);
        }

        let sum = matches.map(v => parseInt(v, base)).reduce((a, b) => a + b, 0);
        return sum;
    }

    // sum up over the sums of the individual selections
    let sum = textSelections.map(sumSingle).reduce((a, b) => a + b, 0);

    return sum;
}
