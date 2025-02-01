"use client"

import type React from "react"
import { useWorkflow } from "../contexts/WorkflowContext"

const NODE_TYPES = ["task", "condition", "notification"]

const AddNodePanel: React.FC = () => {
  const { addNode } = useWorkflow()

  const handleAddNode = (type: string) => {
    addNode(type, { x: 100, y: 100 })
  }

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Add New Node</h2>
      <div className="flex flex-wrap gap-2">
        {NODE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleAddNode(type)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AddNodePanel

