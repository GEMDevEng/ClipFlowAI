# ClipFlowAI Documentation

This directory contains the documentation for ClipFlowAI.

## Directory Structure

- `gitbook/`: Contains the documentation files organized for GitBook publishing
- `GITBOOK_STRUCTURE.md`: Outlines the structure of the GitBook documentation
- `GITBOOK_PUBLISHING.md`: Instructions for publishing to GitBook
- `convert_rtf_to_md.sh`: Script to convert RTF files to Markdown

## Converting RTF to Markdown

To convert the RTF documentation files to Markdown:

1. Make sure you have the necessary tools installed:
   - For macOS: `textutil` (built-in) and `pandoc` (`brew install pandoc`)
   - For Linux: `unrtf` (`apt-get install unrtf`) and `pandoc` (`apt-get install pandoc`)

2. Run the conversion script:
   ```bash
   ./convert_rtf_to_md.sh
   ```

3. The script will convert all RTF files to Markdown and organize them according to the GitBook structure.

## Publishing to GitBook

See `GITBOOK_PUBLISHING.md` for detailed instructions on how to publish the documentation to GitBook.
