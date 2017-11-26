//helper functions for working with the VSCode editor
'use strict'

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

export function getSelectedTexts() : string[] {
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


export function replaceSelections(editor : vscode.TextEditor, selections : vscode.Selection[], replacement : string[]) {
    editor.edit(function (edit: vscode.TextEditorEdit): void {
        selections.forEach((s: vscode.Selection, i: number) => {
            edit.replace(s, replacement[i])
        })
    })
}


export function promptUser(prompt : string, callback : (value : string) => any) : void {
    vscode.window.showInputBox({prompt : prompt}).then(v => callback(v), r => {return})
}

export function promptUserInteger(prompt : string, defaultVal : number, callback : (value : number) => any) : void {
    promptUser(prompt, v => {
        var n = parseInt(v)
        if(isNaN(n)) {
            n = defaultVal
        }
        callback(n)
    })
}

export function promptUserYesNo(prompt : string, defaultVal : boolean, callback : (value : boolean) => any) : void {
    promptUser(prompt + " [y/n]", v => {
        var b = defaultVal ? !v.startsWith("n") : v.startsWith("y")   
        callback(b)
    })
}