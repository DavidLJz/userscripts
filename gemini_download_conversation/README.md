# Gemini Download Conversation

This is a Tampermonkey user script that allows you to download a conversation from Gemini to a markdown file.

## Features

- Adds a floating button to the page to trigger the conversation download.
- Copies each message in the conversation to the clipboard.
- Saves the conversation as a markdown file with a unique filename based on the conversation ID.

![Screenshot of Button](<2025-02-08 183543.png>)

## Usage

1. Navigate to a conversation on the Gemini website.
2. Click the "Save Conversation" button that appears at the bottom right of the page.
3. The script will scroll through the conversation, copy each message, and save the conversation as a markdown file.
4. On first Run the following message may appear. Please click the "Allow" button so the script can continue.

![Screenshot of Prompt](<2025-02-08 190012.png>)

## Chromium Users
Please be aware that Userscripts in TamperMonkey may not work for Chromium-Based browsers other than Chrome. 

Refer to the following FAQ to solve the issue.

https://www.tampermonkey.net/faq.php#Q209

## To Do
- [ ] Include user dialogue in the downloaded file.
- [ ] Allow customizing the export's name.
- [ ] Download as other formats:
    - [ ] PDF
    - [ ] HTML
    - [ ] Zip with Attachments
- [ ] Adjust button style.

## License

This script is provided as-is without any warranty. Use it at your own risk.