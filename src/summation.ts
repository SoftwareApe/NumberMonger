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

function printSum(sum : number[]) : void {
    // Check if this is a sequence of numbers and that it has the correct length
    let notNaN = x => !isNaN(x);
    let isLenOk = sum.length === 4;

    // Display a message box to the user
    let displayText = ['', '', '', ''];
    displayText[0] = isLenOk && notNaN(sum[0]) ? 'Σ = ' + sum[0] : 'Σ = NaN';
    displayText[1] = isLenOk && notNaN(sum[1]) ? 'μ = ' + sum[1] : 'μ = NaN';
    displayText[2] = isLenOk && notNaN(sum[2]) ? 'σ = ' + sum[2] : 'σ = NaN';
    displayText[3] = isLenOk && notNaN(sum[3]) ? 'median = ' + sum[3] : 'median = NaN';
    vscode.window.showQuickPick(displayText);
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

export function sumSequence(textSelections : string[], base : number) : number[] {
    // sum up over the sums of the individual selections
    let numbers = textSelectionToNumbers(textSelections, base);
    let sum = numbers.reduce((a, b) => a + b, 0);
    let len = numbers.length;

    // initialize to 0 in case we can't calculate these values
    let mean = 0;
    let standardDev = 0;
    let median = 0;
    if (len > 0)
    {
        // Need to give a sorting function, otherwise will be sorted as string, which fails with mixed number of digits!
        let sorted = numbers.sort((a, b) => a - b);

        mean = sum / len;
        standardDev = Math.sqrt(numbers.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / len);
        median = 0.0;
        if (len & 1) // odd
        {
            let mid = Math.floor(len / 2);
            median = sorted[mid];
        }
        else // even and minimum 2 (0 case excluded above)
        {
            let mid1 = len / 2;
            let mid2 = mid1 - 1;
            median = (sorted[mid1] + sorted[mid2]) / 2;
        }
    }
    return [sum, mean, standardDev, median];
}
