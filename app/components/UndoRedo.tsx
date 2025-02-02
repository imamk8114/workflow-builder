"use client"

import type React from "react"
import { useWorkflow } from "../contexts/WorkflowContext"
import { Undo2, Redo2 } from "lucide-react"

const UndoRedo: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useWorkflow()

  return (
    <div className="flex space-x-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors"
        title="Undo"
      >
        <Undo2 size={20} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors"
        title="Redo"
      >
        <Redo2 size={20} />
      </button>
    </div>
  )
}

export default UndoRedo

