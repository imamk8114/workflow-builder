"use client"

import type React from "react"
import { useWorkflow } from "../contexts/WorkflowContext"

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
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
      >
        Export
      </button>
      <label className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer text-sm">
        Import
        <input type="file" onChange={handleImport} className="hidden" accept=".json" />
      </label>
    </div>
  )
}

export default ExportImport

