import * as vscode from 'vscode';
import * as editorIO from './editorIO';

export function convertHexToDec() : void {
    convertBaseToBase(16, 10);
}

export function convertDecToHex() : void {
    convertBaseToBase(10, 16);
}

export function convertBinToDec() : void {
    convertBaseToBase(2, 10);
}

export function convertDecToBin() : void {
    convertBaseToBase(10, 2);
}

export function convertBaseToBase(baseFrom : number, baseTo : number) : void {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor => do nothing
    }

    let selections = editor.selections;
    let selectedText = selections.map(s => editor.document.getText(s));

    function replace(prefix : boolean) : void {
        let replacements = selectedText.map(t => convertStringBaseToBase(t, baseFrom, baseTo, prefix));

        editorIO.replaceSelections(editor, selections, replacements);
    }

    let prompt = 'Add ' + getPrefix(baseTo) + ' prefix? (y)';
    if (prompt !== '') {
        editorIO.promptUserYesNo(prompt, true, replace);
    }
    else { // no known prefix for this base
        replace(false);
    }
}


export function convertStringBaseToBase(text : string, baseFrom : number, baseTo : number, isPrefixed : boolean) : string {
    let regex = getRegex(baseFrom);

    let replaced = text.replace(regex, (n, g1, g2 : string) => {
        let found = parseInt(g2, baseFrom);
        if (isNaN(found)) { // leave things untouched if replacement doesn't work
            return n;
        }
        else {
            let prefix = isPrefixed ? getPrefix(baseTo) : '';
            return g1 + prefix + found.toString(baseTo).toUpperCase();
        }
    });

    return replaced;
}


export function getRegex(base : number) : RegExp {
    let regex : RegExp;
    switch (base)
    {
        case 0: // floating point special case
            regex = /(\-?)((?:[0-9]+\.?[0-9]*|[0-9]*\.?[0-9]+)(?:[eE][\+\-]?[0-9]+)?)/g;
            break;
        case 10:
            regex = /(\-?)([0-9]+)/g;
            break;
        case 16:
            regex = /(\-?)(?:0x)?([a-fA-F0-9]+)/g;
            break;
        case 2:
            regex = /(\-?)(?:0b)?([0-1]+)/g;
            break;
        default:
            console.log('Tried to get regex for base ' + base + ', which is not implemented');
    }

    return regex;
}

export function getRegexFloat() : RegExp {
    return ;
}

export function getPrefix(base : number) : string {
    switch (base)
    {
        case 16:
            return '0x'; // hex
        case 8:
            return '0o'; // octal
        case 2:
            return '0b'; // bin
        default:
            return '';   // other
    }
}
