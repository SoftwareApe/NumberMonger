// helper functions for working with the VSCode editor
'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function getSelectedTexts() : string[] {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return []; // No open text editor
    }

    let texts : string[] = [];
    let selections = editor.selections;

    if (selections.length > 1) { // user used multiple selections
        texts = selections.map(s => editor.document.getText(s));
    } else if (selections.length === 1) { // single selection => first need to split on newlines
        let text = editor.document.getText(selections[0]);
        texts = text.split(/\r?\n/);
    }

    return texts;
}


export function replaceSelections(editor : vscode.TextEditor, selections : vscode.Selection[], replacement : string[]) : void {
    editor.edit(function (edit : vscode.TextEditorEdit) : void {
        selections.forEach((s : vscode.Selection, i : number) => {
            edit.replace(s, replacement[i]);
        });
    });
}


export function promptUser(prompt : string, callback : (value : string) => any) : void {
    // if user presses escape the promise is actually fulfilled with value *undefined*
    vscode.window.showInputBox({prompt : prompt}).then(v => { if (v !== undefined) { return callback(v); } else { return; } }, r => { return; });
}

export function promptUserInteger(prompt : string, defaultVal : number, callback : (value : number) => any) : void {
    promptUser(prompt, v => {
        let n = parseInt(v);
        if (isNaN(n)) {
            n = defaultVal;
        }
        callback(n);
    });
}

export function promptUserYesNo(prompt : string, defaultVal : boolean, callback : (value : boolean) => any) : void {
    promptUser(prompt + ' [y/n]', v => {
        let b = defaultVal ? !v.startsWith('n') : v.startsWith('y');
        callback(b);
    });
}
