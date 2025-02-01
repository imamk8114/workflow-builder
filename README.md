# Workflow Builder

A modern web application for creating, managing, and sharing workflow configurations with an intuitive user interface.

## Features

- **Visual Workflow Editor**: Create and modify workflows through an interactive interface
- **Export/Import**: Share workflows by exporting and importing JSON configurations
- **Modern UI**: Built with React and styled using Tailwind CSS
- **Type-Safe**: Developed using TypeScript for enhanced reliability

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```


### Development
```bash
- npm run dev
```

## Usage

### Exporting Workflows
1. Create your workflow using the builder interface
2. Click the "Export" button to download your workflow as a JSON file
3. The workflow will be saved as workflow.json
   
### Importing Workflows
1. Click the "Import" button
2. Select a previously exported workflow JSON file
3. The workflow will be loaded into the builder

### Tech Stack

React
TypeScript
Tailwind CSS
File System API
Blob API

### Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## Design Decisions and Tradeoffs

### Component Architecture

- **Modular Export/Import**: Separated into a standalone component for better maintainability and reusability
- **Hooks-based State Management**: Using custom hooks (useWorkflow) instead of global state management for simpler workflows
- **File Handling**: Browser's native File API used for simplicity over custom file handling solutions

### UI/UX Choices

- **Minimal Interface**: Export/Import contained in simple buttons to reduce cognitive load
- **Native File Picker**: Leveraging browser's file dialog instead of custom dropzone for better OS integration
- **Immediate Downloads**: Direct file generation and download instead of server-side storage

### Technical Decisions

- **JSON Format**: 
  - Pros: Human-readable, widely supported, easy to validate
  - Cons: Larger file size compared to binary formats
- **Client-side Processing**:
  - Pros: Fast response, works offline, no server costs
  - Cons: Limited by browser capabilities and memory

### Security Considerations

- File operations handled entirely client-side to prevent server vulnerabilities
- JSON validation performed during import to maintain data integrity
