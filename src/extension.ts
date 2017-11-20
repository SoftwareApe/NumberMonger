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
    let sumSeqDec = vscode.commands.registerCommand('extension.sumSequence', () => sumSequence(10));
    let sumSeqHex = vscode.commands.registerCommand('extension.sumSequenceHex', () => sumSequence(16));
    let sumSeqBin = vscode.commands.registerCommand('extension.sumSequenceBin', () => sumSequence(2));

    context.subscriptions.push(sumSeqDec);
    context.subscriptions.push(sumSeqHex);
    context.subscriptions.push(sumSeqBin);
}

function sumSequence(base : number) {
    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    
    var selections = editor.selections;
    var texts : string[] = []
    if(selections.length > 1) { // user used multiple selections
        texts = selections.map(s => editor.document.getText(s))
    } else if(selections.length === 1) { // single selection => first need to split on newlines
        var text = editor.document.getText(selections[0])
        texts = text.split(/\r?\n/)
    }

    //try to convert sequence of numbers
    var sum = texts.map(t => parseInt(t, base)).reduce((a, b) => a + b, 0);

    // Check if this is a sequence of numbers
    var isNumber = !isNaN(sum)
    
    // Display a message box to the user
    var displayText = isNumber ? "Sum of sequence: " + sum : "Error: Couldn't parse numbers in sequence."
    vscode.window.showInformationMessage(displayText);
}


// this method is called when your extension is deactivated
export function deactivate() {
}