import * as vscode from 'vscode';
import { GoogleGenAI } from '@google/genai';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "my-gemini-agent" is now active!');

    // Initialize the Gemini API client
    // WARNING: For a production extension, store this securely (e.g., using vscode.SecretStorage)
    const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6LyRnQJjJ6M2GTV6XJeeDUUaKhfrCLSyvOOtDTFKzK5AQ' });

    let disposable = vscode.commands.registerCommand('my-gemini-agent.askGemini', async () => {
        // 1. Ask the user for a prompt
        const userInput = await vscode.window.showInputBox({
            prompt: 'Ask Gemini a coding question or give a refactoring instruction',
            placeHolder: 'e.g., Optimize this component...'
        });

        if (!userInput) {
            return; // User canceled the input
        }

        // 2. Get the currently active file's text for context
        const editor = vscode.window.activeTextEditor;
        const documentText = editor ? editor.document.getText() : 'No file open.';

        try {
            vscode.window.showInformationMessage('Gemini is thinking...');

            // 3. Call Gemini with context and tailored instructions
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                config: {
                    systemInstruction: 'You are an expert frontend developer assistant specializing in React and Tailwind CSS. Provide clear, concise code.',
                },
                contents: `Here is the current file context:\n\n${documentText}\n\nUser Request: ${userInput}`
            });

            // 4. Display the response in a new tab (Untitled file) so it's easy to read
            const document = await vscode.workspace.openTextDocument({
                content: response.text,
                language: 'markdown' // Renders code blocks nicely
            });
            await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);

        } catch (error) {
            vscode.window.showErrorMessage(`Gemini API Error: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}