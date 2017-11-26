'use strict'

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import * as editorIO from './editorIO'
import * as convert from './convert'
import * as sequences from './sequences'

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
            "callback" : sequences.createSequenceDec
        },
        {
            "name" : "extension.createSequenceHex",
            "callback" : sequences.createSequenceHex
        },
        {
            "name" : "extension.createSequenceBin",
            "callback" : sequences.createSequenceBin
        },
        {
            "name" : "extension.createRandomSequenceDec",
            "callback" : sequences.createRandomSequenceDec
        },
        {
            "name" : "extension.createRandomSequenceHex",
            "callback" : sequences.createRandomSequenceHex
        },
        {
            "name" : "extension.createRandomSequenceBin",
            "callback" : sequences.createRandomSequenceBin
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

// this method is called when your extension is deactivated
export function deactivate() {
}