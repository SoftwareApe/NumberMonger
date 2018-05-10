'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as convert from './convert';
import * as sequences from './sequences';
import * as summation from './summation';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context : vscode.ExtensionContext) : void {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "NumberMonger" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let commands =
    [
        {
            'name' : 'extension.sumSequenceDec',
            'callback' : summation.sumSequenceDec
        },
        {
            'name' : 'extension.sumSequenceHex',
            'callback' : summation.sumSequenceHex
        },
        {
            'name' : 'extension.sumSequenceBin',
            'callback' : summation.sumSequenceBin
        },
        {
            'name' : 'extension.createSequenceDec',
            'callback' : sequences.createSequenceDec
        },
        {
            'name' : 'extension.createSequenceHex',
            'callback' : sequences.createSequenceHex
        },
        {
            'name' : 'extension.createSequenceBin',
            'callback' : sequences.createSequenceBin
        },
        {
            'name' : 'extension.createRandomSequenceDec',
            'callback' : sequences.createRandomSequenceDec
        },
        {
            'name' : 'extension.createRandomSequenceHex',
            'callback' : sequences.createRandomSequenceHex
        },
        {
            'name' : 'extension.createRandomSequenceBin',
            'callback' : sequences.createRandomSequenceBin
        },
        {
          'name': 'extension.convertHexToDec',
          'callback': convert.convertHexToDec
        },
        {
          'name': 'extension.convertDecToHex',
          'callback': convert.convertDecToHex
        },
        {
          'name': 'extension.convertBinToDec',
          'callback': convert.convertBinToDec
        },
        {
          'name': 'extension.convertDecToBin',
          'callback': convert.convertDecToBin
        }
    ];

    // register all commands
    commands.map(command => {
        let subscription = vscode.commands.registerCommand(command.name, command.callback);
        context.subscriptions.push(subscription);
    });
}

// this method is called when your extension is deactivated
export function deactivate() : void {
    return;
}
