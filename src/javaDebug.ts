'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    //let configurations = vscode.workspace.getConfiguration('javaDebug');
    
    let outputChannel = vscode.window.createOutputChannel('Java Debug');    
    outputChannel.appendLine('"java-debug" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json    
    let compile = vscode.commands.registerCommand('javaDebug.compile', () => {
        outputChannel.clear();
        outputChannel.show();

        let editor = vscode.window.activeTextEditor;
        let fullFileName = editor.document.fileName;
        if (!editor || !fullFileName) {
            return; 
        }
        if (!fullFileName.endsWith('.java')) {
            return;
        }
        if (editor.document.isDirty) {
            outputChannel.appendLine('File saved.');
            editor.document.save();
        }

        let exec = require('child_process').exec;
        let cmd = 'javac -encoding utf8 "' + fullFileName + '"';

        outputChannel.appendLine('Execute command: ' + cmd);
        exec(cmd, function (error, stdout, stderr) {
            if (stderr) {
                outputChannel.appendLine(stderr);
                return;
            }
            outputChannel.appendLine('Success!');
        });
    });

    let run = vscode.commands.registerCommand('javaDebug.run', () => {
        outputChannel.clear();

        let editor = vscode.window.activeTextEditor;
        let fullFileName = editor.document.fileName;
        if (!editor || !fullFileName) {
            return;
        }
        if (!fullFileName.endsWith('.java')) {
            return;
        }

        let isUnixLike = fullFileName.startsWith('/');
        let fileNameIndex = isUnixLike ? fullFileName.lastIndexOf('/') : fullFileName.lastIndexOf('\\');
        let fileName = fullFileName.substring(fileNameIndex + 1);
        let folderPath = fullFileName.substring(0, fileNameIndex);
        let className = fileName.substring(0, fileName.indexOf('.java'));

        let exec = require('child_process').exec;
        let cmd = 'java -cp "' + folderPath + '" "' + className + '"';

        vscode.window.setStatusBarMessage('Execute command: ' + cmd);

        exec(cmd, function (error, stdout, stderr) {
            if (stderr) {
                outputChannel.appendLine(stderr);
            } else if (stdout) {
                outputChannel.appendLine(stdout);
            }
        });
    });

    context.subscriptions.push(compile);
    context.subscriptions.push(run);
}

// this method is called when your extension is deactivated
export function deactivate() {
}