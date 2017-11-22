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
    let commands =
    [
        {
            "name" : "extension.sumSequenceDec",
            "callback" : sumSequenceDec
        },
        {
            "name" : "extension.sumSequenceHex",
            "callback" : sumSequenceHex
        },
        {
            "name" : "extension.sumSequenceBin",
            "callback" : sumSequenceBin
        },
        {
            "name" : "extension.createSequenceDec",
            "callback" : createSequenceDec
        },
        {
            "name" : "extension.createSequenceHex",
            "callback" : createSequenceHex
        },
        {
            "name" : "extension.createSequenceBin",
            "callback" : createSequenceBin
        },
        {
          "name": "extension.convertHexToDec",
          "callback": convertHexToDec
        },
        {
          "name": "extension.convertDecToHex",
          "callback": convertDecToHex
        },
        {
          "name": "extension.convertBinToDec",
          "callback": convertBinToDec
        },
        {
          "name": "extension.convertDecToBin",
          "callback": convertDecToBin
        }
    ]

    //register all commands
    commands.map(command => {
        var subscription = vscode.commands.registerCommand(command.name, command.callback)
        context.subscriptions.push(subscription)
    })
}

function convertHexToDec() {
    convertBaseToBase(16, 10)
}

function convertDecToHex() {
    convertBaseToBase(10, 16)
}

function convertBinToDec() {
    convertBaseToBase(2, 10)
}

function convertDecToBin() {
    convertBaseToBase(10, 2)
}

function convertBaseToBase(baseFrom : number, baseTo :number) {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
        return // No open text editor => do nothing
    }

    var selections = editor.selections
    var selectedText = selections.map(s => editor.document.getText(s))

    var replacements = selectedText.map(t => convertStringBaseToBase(t, baseFrom, baseTo, true))

    replaceSelections(editor, selections, replacements)
}

function getPrefix(base : number) : string {
    switch(base)
    {
        case 16:
            return "0x" //hex
        case 8:
            return "0o" //octal
        case 2:
            return "0b" //bin
        default:
            return ""   //other
    }
}

export function convertStringBaseToBase(text : string, baseFrom : number, baseTo : number, isPrefixed: boolean) : string {
    var regex = baseFrom === 16 ? /(\-?)(?:0x)?([a-fA-F0-9]+)/g : baseFrom === 10 ? /(\-?)([0-9]+)/g : /(\-?)(?:0b)?([0-1]+)/g
    
    var replaced = text.replace(regex, (n, g1, g2 : string) => {
        var found = parseInt(g2, baseFrom)
        if(isNaN(found)) { //leave things untouched if replacement doesn't work
            return n
        }
        else {
            var prefix = isPrefixed ? getPrefix(baseTo) : ""
            return g1 + prefix + found.toString(baseTo).toUpperCase()
        }
    })

    return replaced
}

function createSequenceDec() {
    createSequenceAny(10)    
}

function createSequenceHex() {
    createSequenceAny(16)    
}

function createSequenceBin() {
    createSequenceAny(2)    
}

function replaceSelections(editor : vscode.TextEditor, selections : vscode.Selection[], replacement : string[]) {
    editor.edit(function (edit: vscode.TextEditorEdit): void {
        selections.forEach((s: vscode.Selection, i: number) => {
            edit.replace(s, replacement[i])
        })
    })
}

function promptUser(prompt : string, callback : (value : string) => any) : void {
    vscode.window.showInputBox({prompt : prompt}).then(v => callback(v), r => {return})
}

function promptUserInteger(prompt : string, defaultVal : number, callback : (value : number) => any) : void {
    promptUser(prompt, v => {
        var n = parseInt(v)
        if(isNaN(n)) {
            n = defaultVal
        }
        callback(n)
    })
}

function promptUserYesNo(prompt : string, defaultVal : boolean, callback : (value : boolean) => any) : void {
    promptUser(prompt + " [y/n]", v => {
        var b = defaultVal ? v.startsWith("y") : !v.startsWith("n")   
        callback(b)
    })
}

function createSequenceAny(base : number) {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
        return // No open text editor => do nothing
    }

    promptUserInteger('Sequence start (0)', 0, 
        start => {
            promptUserInteger('Sequence step size (1)', 1,
                stepSize => {
                    promptUserYesNo('Right align? (n)', false,
                        isRightAligned => {
                            promptUserYesNo('Zero pad? (n)', false,
                                isZeroPadded => { 
                                    var selections = editor.selections;
                                    var nValues = selections.length
                                    var sequence = createSequence(start, nValues, stepSize)
                                    var output = numbersToString(sequence, base, isRightAligned, isZeroPadded)
                                
                                    replaceSelections(editor, selections, output)
                            })
                    })
            })    
    })
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