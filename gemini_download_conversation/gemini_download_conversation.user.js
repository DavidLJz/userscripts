// ==UserScript==
// @name         Gemini Download Conversation
// @namespace    https://github.com/DavidLJz/userscripts
// @version      0.0.1
// @time         2025-06-08 17:04:00
// @description  Download a conversation from Gemini to a markdown file.
// @author       DavidLJz - 4dlj1995@gmail.com
// @license      MIT
// @match        https://gemini.google.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    const logger = (msg, level = 'log') => {
        console[level](`[Gemini Download Conversation] ${msg}`);
    }

    logger('Script started'); // Add this line to verify script execution

    const getCopyButton = () => {
        const icon = document.querySelector('.mat-menu-above mat-icon[data-mat-icon-name="content_copy"]')

        if (!icon) {
            throw new Error('Copy button not found.');
        }

        const btn = icon.closest('button');

        if (!btn) {
            throw new Error('Button not found.');
        }

        return btn;
    }

    const getConversationIdFromUrl = () => {
        const url = window.location.href;

        // https://gemini.google.com/app/xxxx
        const urlParts = url.split('/');

        if (urlParts.length < 5) {
            throw new Error('Invalid URL.');
        }

        return urlParts[4];
    }

    const downloadMarkdownFile = (filename, text) => {
        const blob = new Blob([text], { type: 'text/markdown' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = filename;

        a.click();

        logger('Conversation saved.');

        URL.revokeObjectURL(url);

        a.remove();
    }

    const saveConversation = async (chatWindow) => {
        if (!chatWindow) {
            logger('Chat window not found. Exiting.', 'error');
            return;
        }

        logger('Saving conversation...');

        const messages = chatWindow.querySelectorAll('model-response .more-menu-button')

        if (!messages.length) {
            logger('No messages found. Exiting.', 'error');
            return;
        }

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        const fullTextList = [];

        for (let index = 0; index < messages.length; index++) {
            const menuButton = messages[index];

            logger(`Saving message ${index + 1} of ${messages.length}...`);

            try {
                menuButton.dispatchEvent(clickEvent);

                getCopyButton().dispatchEvent(clickEvent);

                // Wait for message to be copied and then check the clipboard
                await new Promise(resolve => setTimeout(resolve, 1250));

                const text = await navigator.clipboard.readText();

                if (!text) {
                    throw new Error('No text copied.');
                }

                fullTextList.push(text);

                logger(`Message ${index + 1} of ${messages.length} copied: ${text.length > 50 ? text.substring(0, 50) + '...' : text}`);
            }
            catch (error) {
                logger('Error copying message.', 'error');
                logger(error, 'error');
            }
        }

        if (!fullTextList.length) {
            logger('No messages copied. Exiting.', 'error');
            return;
        }

        const conversationId = getConversationIdFromUrl();

        const separator = '\n\n---\n\n';

        const fullText = fullTextList.join(separator);

        logger('All messages copied. Saving to file...');

        downloadMarkdownFile(`gemini-${conversationId}.md`, fullText);

        logger('Exiting.');
    }

    const getChatWindow = async () => {
        let chatWindow = null;

        while (!chatWindow) {
            logger('Waiting for chat window...');

            chatWindow = document.querySelector('chat-window infinite-scroller');

            if (chatWindow) {
                logger('Chat window found.');
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return chatWindow;
    }

    const chatWindow = await getChatWindow();

    if (!chatWindow) {
        logger('Chat window not found. Exiting.', 'error');
        return;
    }

    const floatingTriggerButton = document.createElement('button');

    floatingTriggerButton.textContent = 'Save Conversation';
    floatingTriggerButton.style.position = 'fixed';
    floatingTriggerButton.style.bottom = '10px';
    floatingTriggerButton.style.right = '10px';
    floatingTriggerButton.style.zIndex = '9999';
    floatingTriggerButton.style.padding = '10px';
    floatingTriggerButton.style.border = 'none';
    floatingTriggerButton.style.backgroundColor = 'green';
    floatingTriggerButton.style.color = 'white';
    floatingTriggerButton.style.cursor = 'pointer';

    logger('Chat window found. Waiting for user click to start saving...');

    floatingTriggerButton.addEventListener('click', () => {
        logger('User clicked. Starting to save conversation...');

        // Scroll until all messages are loaded
        const scrollInterval = setInterval(() => {
            chatWindow.scrollTop = 0;

            if (chatWindow.scrollTop === 0) {
                clearInterval(scrollInterval);
                logger('All messages loaded.');
                saveConversation(chatWindow);
            }

        }, 1000);
    }, { once: true });

    document.body.appendChild(floatingTriggerButton);
})();