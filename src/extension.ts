'use strict'

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import * as editorIO from './editorIO'
import * as convert from './convert'

import leftPad = require('left-pad')
import sprintfJs = require('sprintf-js')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "NumberMonger" is now active!');

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
            "name" : "extension.createRandomSequenceDec",
            "callback" : createRandomSequenceDec
        },
        {
            "name" : "extension.createRandomSequenceHex",
            "callback" : createRandomSequenceHex
        },
        {
            "name" : "extension.createRandomSequenceBin",
            "callback" : createRandomSequenceBin
        },
        {
          "name": "extension.convertHexToDec",
          "callback": convert.convertHexToDec
        },
        {
          "name": "extension.convertDecToHex",
          "callback": convert.convertDecToHex
        },
        {
          "name": "extension.convertBinToDec",
          "callback": convert.convertBinToDec
        },
        {
          "name": "extension.convertDecToBin",
          "callback": convert.convertDecToBin
        }
    ]

    //register all commands
    commands.map(command => {
        var subscription = vscode.commands.registerCommand(command.name, command.callback)
        context.subscriptions.push(subscription)
    })
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

function createRandomSequenceDec() {
    createRandomSequenceAny(10)    
}

function createRandomSequenceHex() {
    createRandomSequenceAny(16)    
}

function createRandomSequenceBin() {
    createRandomSequenceAny(2)    
}

function createSequenceAny(base : number) {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
        return // No open text editor => do nothing
    }

    editorIO.promptUserInteger('Sequence start (0)', 0, start => {
        editorIO.promptUserInteger('Sequence step size (1)', 1, stepSize => {
            editorIO.promptUserYesNo('Right align? (n)', false, isRightAligned => {
                editorIO.promptUserYesNo('Zero pad? (n)', false, isZeroPadded => { 
                        var selections = editor.selections;
                        var nValues = selections.length
                        var sequence = createSequence(start, nValues, stepSize)
                        var output = numbersToString(sequence, base, isRightAligned, isZeroPadded)
                    
                        editorIO.replaceSelections(editor, selections, output)
                })
            })
        })    
    })
}

function createRandomSequenceAny(base : number) {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
        return // No open text editor => do nothing
    }

    editorIO.promptUserInteger('Min (0) [int]', 0, min => {
        editorIO.promptUserInteger('Max (4294967295) [int]', 4294967295, max => {
            editorIO.promptUserYesNo('Right align? (n)', false, isRightAligned => {
                editorIO.promptUserYesNo('Zero pad? (n)', false, isZeroPadded => { 
                        var selections = editor.selections;
                        var nValues = selections.length
                        var sequence = createRandomSequence(min, max, nValues)
                        var output = numbersToString(sequence, base, isRightAligned, isZeroPadded)
                    
                        editorIO.replaceSelections(editor, selections, output)
                })
            })
        })    
    })
}

function sumSequenceDec() {
    printSum(sumSequence(editorIO.getSelectedTexts(), 10))
}

function sumSequenceHex() {
    printSum(sumSequence(editorIO.getSelectedTexts(), 16))
}

function sumSequenceBin() {
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

export function createRandomSequence(min : number, max : number, nValues : number) : number[] {
    var seq = [];
    
    for (var i = 0; i < nValues; ++i) {
        seq.push(getRandomInt(min, max));
    }

    return seq
}

function getRandomInt(min : number, max : number) : number
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this method is called when your extension is deactivated
export function deactivate() {
}