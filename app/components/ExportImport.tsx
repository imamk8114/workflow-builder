"use client"

import type React from "react"
import { useWorkflow } from "../contexts/WorkflowContext"
import { Download, Upload } from "lucide-react"

const ExportImport: React.FC = () => {
  const { exportWorkflow, importWorkflow } = useWorkflow()

  const handleExport = () => {
    const jsonString = exportWorkflow()
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workflow.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === "string") {
          importWorkflow(content)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleExport}
        className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
        title="Export Workflow"
      >
        <Download size={20} />
      </button>
      <label
        className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 cursor-pointer transition-colors"
        title="Import Workflow"
      >
        <Upload size={20} />
        <input type="file" onChange={handleImport} className="hidden" accept=".json" />
      </label>
    </div>
  )
}

export default ExportImport