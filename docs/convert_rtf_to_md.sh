#!/bin/bash

# This script converts RTF files to Markdown and organizes them according to the GitBook structure

# Check if textutil is available (macOS)
if command -v textutil &> /dev/null; then
    CONVERTER="textutil"
    echo "Using textutil for conversion"
# Check if unrtf is available (Linux)
elif command -v unrtf &> /dev/null; then
    CONVERTER="unrtf"
    echo "Using unrtf for conversion"
else
    echo "Error: No RTF converter found. Please install textutil (macOS) or unrtf (Linux)"
    exit 1
fi

# Create directories if they don't exist
mkdir -p docs/gitbook/{introduction,getting-started,user-guide,technical-documentation,development-guide,deployment,appendix}

# Function to convert RTF to Markdown
convert_rtf_to_md() {
    local rtf_file=$1
    local md_file=$2
    
    echo "Converting $rtf_file to $md_file"
    
    if [ "$CONVERTER" = "textutil" ]; then
        # macOS conversion
        textutil -convert html "$rtf_file" -output temp.html
        pandoc -f html -t markdown_github temp.html -o "$md_file"
        rm temp.html
    else
        # Linux conversion
        unrtf --text "$rtf_file" | pandoc -f html -t markdown_github -o "$md_file"
    fi
    
    echo "Conversion complete: $md_file"
}

# Convert and organize RTF files according to the GitBook structure
convert_rtf_to_md "0.1 Upwork Project Description.rtf" "docs/gitbook/introduction/project-background.md"
convert_rtf_to_md "0.2 Automated Viral Video Creation SOP.rtf" "docs/gitbook/user-guide/video-creation-workflow.md"
convert_rtf_to_md "1. Job Analysis.rtf" "docs/gitbook/introduction/project-analysis.md"
convert_rtf_to_md "2. WBS.rtf" "docs/gitbook/development-guide/work-breakdown.md"
convert_rtf_to_md "3. PRD.rtf" "docs/gitbook/technical-documentation/product-requirements.md"
convert_rtf_to_md "4.SRS.rtf" "docs/gitbook/technical-documentation/software-requirements.md"
convert_rtf_to_md "5. Frontend Guidelines.rtf" "docs/gitbook/development-guide/frontend-guidelines.md"
convert_rtf_to_md "5a. UI Example from Bolddotnew.rtf" "docs/gitbook/development-guide/ui-examples.md"
convert_rtf_to_md "6. Backend Structure.rtf" "docs/gitbook/technical-documentation/backend-structure.md"
convert_rtf_to_md "7. App Flow Document.rtf" "docs/gitbook/technical-documentation/application-flow.md"
convert_rtf_to_md "8. Features Results Document.rtf" "docs/gitbook/introduction/feature-results.md"
convert_rtf_to_md "9. Tech Stack.rtf" "docs/gitbook/technical-documentation/tech-stack.md"
convert_rtf_to_md "10. Project Rules.rtf" "docs/gitbook/development-guide/project-rules.md"
convert_rtf_to_md "11. Implementation Plan.rtf" "docs/gitbook/development-guide/implementation-plan.md"
convert_rtf_to_md "12. Task List.rtf" "docs/gitbook/development-guide/task-list.md"
convert_rtf_to_md "13. Tickets.rtf" "docs/gitbook/development-guide/tickets.md"
convert_rtf_to_md "14. Directory Structure.rtf" "docs/gitbook/technical-documentation/directory-structure.md"

echo "All RTF files have been converted to Markdown and organized according to the GitBook structure"
