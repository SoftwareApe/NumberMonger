import * as vscode from 'vscode'
import * as editorIO from './editorIO'

export function convertHexToDec() {
    convertBaseToBase(16, 10)
}

export function convertDecToHex() {
    convertBaseToBase(10, 16)
}

export function convertBinToDec() {
    convertBaseToBase(2, 10)
}

export function convertDecToBin() {
    convertBaseToBase(10, 2)
}

export function convertBaseToBase(baseFrom : number, baseTo :number) {
    var editor = vscode.window.activeTextEditor
    if (!editor) {
        return // No open text editor => do nothing
    }

    var selections = editor.selections
    var selectedText = selections.map(s => editor.document.getText(s))

    function replace(prefix : boolean) {
        var replacements = selectedText.map(t => convertStringBaseToBase(t, baseFrom, baseTo, prefix))
        
        editorIO.replaceSelections(editor, selections, replacements)
    }

    var prompt = "Add " + getPrefix(baseTo) + " prefix? (y)"
    if(prompt != "") {
        editorIO.promptUserYesNo(prompt, true, replace)
    }
    else { //no known prefix for this base
        replace(false)
    }
}


export function convertStringBaseToBase(text : string, baseFrom : number, baseTo : number, isPrefixed: boolean) : string {
    var regex = getRegex(baseFrom)
    
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


export function getRegex(base : number) : RegExp {
    var regex = base === 16 ? /(\-?)(?:0x)?([a-fA-F0-9]+)/g : base === 10 ? /(\-?)([0-9]+)/g : /(\-?)(?:0b)?([0-1]+)/g
    return regex
}


export function getPrefix(base : number) : string {
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