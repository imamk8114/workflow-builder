"use client"

import type React from "react"
import { useWorkflow } from "../contexts/WorkflowContext"

const UndoRedo: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useWorkflow()

  return (
    <div className="flex space-x-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 text-sm"
      >
        Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 text-sm"
      >
        Redo
      </button>
    </div>
  )
}

export default UndoRedo

