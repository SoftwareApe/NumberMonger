import * as editorIO from './editorIO'
import * as convert from './convert'
import * as vscode from 'vscode'

export function sumSequenceDec() {
    printSum(sumSequence(editorIO.getSelectedTexts(), 10))
}

export function sumSequenceHex() {
    printSum(sumSequence(editorIO.getSelectedTexts(), 16))
}

export function sumSequenceBin() {
    printSum(sumSequence(editorIO.getSelectedTexts(), 2))
}

function printSum(sum : number) {
    // Check if this is a sequence of numbers
    var isNumber = !isNaN(sum)
    
    // Display a message box to the user
    var displayText = isNumber ? "Sum of sequence: " + sum : "Error: Couldn't parse numbers in sequence."
    vscode.window.showInformationMessage(displayText);
}
 

export function sumSequence(textSelections : string[], base : number) : number {
    //function for summing up the numbers in a single selection
    var regex = convert.getRegex(base)
    function sumSingle(text: string) : number {
        var matches : string[] = []
        var found : RegExpExecArray
        while (found = regex.exec(text)) {
            //first group is the sign, second group is the number, in case there are prefixes in between
            matches.push(found[1] + found[2])
        }

        var sum = matches.map(v => parseInt(v, base)).reduce((a, b) => a + b, 0)
        return sum
    }
    
    //sum up over the sums of the individual selections
    var sum = textSelections.map(sumSingle).reduce((a, b) => a + b, 0)

    return sum
}
