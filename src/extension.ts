'use strict'

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import leftPad = require('left-pad')
import sprintfJs = require('sprintf-js')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "numbermonger" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let sumSeqDec = vscode.commands.registerCommand('extension.sumSequenceDec', sumSequenceDec)
    let sumSeqHex = vscode.commands.registerCommand('extension.sumSequenceHex', sumSequenceHex)
    let sumSeqBin = vscode.commands.registerCommand('extension.sumSequenceBin', sumSequenceBin)
    let createSeqDec = vscode.commands.registerCommand('extension.createSequenceDec', createSequenceDec)
    context.subscriptions.push(sumSeqDec)
    context.subscriptions.push(sumSeqHex)
    context.subscriptions.push(sumSeqBin)
    context.subscriptions.push(createSeqDec)
}

function createSequenceDec() {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
        return // No open text editor => do nothing
    }

    vscode.window.showInputBox({prompt: 'Sequence start (0)'}).then(
        v => {
            var start = parseInt(v)
            if(isNaN(start)) {
                start = 0
            }
            vscode.window.showInputBox({prompt: 'Sequence step size (1)'}).then(
                v => {
                    var stepSize = parseInt(v)
                    if(isNaN(stepSize)) {
                        stepSize = 1 //default
                    }
                    vscode.window.showInputBox({prompt: 'Right align? y/n (n)'}).then(
                        v => {
                            var isRightAligned = v.startsWith("y") 
                            vscode.window.showInputBox({prompt: 'Zero pad? y/n (n)'}).then(
                                v => {
                                    var isZeroPadded = v.startsWith("y") 
                                    var selections = editor.selections;
                                    var nValues = selections.length
                                    var sequence = createSequence(start, nValues, stepSize)
                                    var output = numbersToString(sequence, 10, isRightAligned, isZeroPadded)
                                
                                    editor.edit(function (edit: vscode.TextEditorEdit): void {
                                        selections.forEach((s: vscode.Selection, i: number) => {
                                            edit.replace(s, output[i])
                                        })
                                    })
                                }, r => {return})
                        }, r => {return})
                }, r => {return})    
        }, r => {return})
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

export function numbersToString(numbers : number[], base : number, isRightAligned : boolean, isZeroPadded : boolean) : string[] {
    //separate signs and string representation
    var strings = numbers.map(n => Math.abs(n).toString(base).toUpperCase())
    var signs = numbers.map(n => n < 0 ? "-" : "")

    var formatString : string = "%s%s"
    if(isZeroPadded) {
        var maxAbsLength = strings.map(s => s.length).reduce((a, b) => Math.max(a, b), 0)
        formatString = "%s%0" + maxAbsLength + "s"
    }

    strings = strings.map((s, i) => sprintfJs.sprintf(formatString, signs[i], s))
    
    // right align
    if(isRightAligned) { 
        var maxLength = strings.map(s => s.length).reduce((a, b) => Math.max(a, b), 0)
        strings = strings.map(s => leftPad(s, maxLength))
    }

    return strings
}

export function createSequence(start : number, nValues : number, stepSize : number) : number[] {
    var seq = [];
    
    for (var i = 0; i < nValues; ++i) {
        seq.push(start + i * stepSize);
    }

    return seq
}

// this method is called when your extension is deactivated
export function deactivate() {
}