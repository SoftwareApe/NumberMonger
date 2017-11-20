'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "numbermonger" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let sumSeqDec = vscode.commands.registerCommand('extension.sumSequence', sumSequenceDec);
    let sumSeqHex = vscode.commands.registerCommand('extension.sumSequenceHex', sumSequenceHex);
    let sumSeqBin = vscode.commands.registerCommand('extension.sumSequenceBin', sumSequenceBin);
    context.subscriptions.push(sumSeqDec);
    context.subscriptions.push(sumSeqHex);
    context.subscriptions.push(sumSeqBin);
}

function sumSequenceDec() {
    printSum(sumSequence(getSelectedTexts(), 10))
}

function sumSequenceHex() {
    printSum(sumSequence(getSelectedTexts(), 16))
}

function sumSequenceBin() {
    printSum(sumSequence(getSelectedTexts(), 2))
}

function printSum(sum : number) {
    // Check if this is a sequence of numbers
    var isNumber = !isNaN(sum)
    
    // Display a message box to the user
    var displayText = isNumber ? "Sum of sequence: " + sum : "Error: Couldn't parse numbers in sequence."
    vscode.window.showInformationMessage(displayText);
}

function getSelectedTexts() : string[] {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return []; // No open text editor
    }

    var texts : string[] = []
    var selections = editor.selections;
    
    if(selections.length > 1) { // user used multiple selections
        texts = selections.map(s => editor.document.getText(s))
    } else if(selections.length === 1) { // single selection => first need to split on newlines
        var text = editor.document.getText(selections[0])
        texts = text.split(/\r?\n/)
    }

    return texts
} 

export function sumSequence(textSelections : string[], base : number) : number {
    //try to convert sequence of numbers
    var sum = textSelections.map(t => parseInt(t, base)).reduce((a, b) => a + b, 0)

    return sum
}


// this method is called when your extension is deactivated
export function deactivate() {
}