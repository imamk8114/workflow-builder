"use client"

import type React from "react"
import { useState } from "react"
import { useWorkflow } from "../contexts/WorkflowContext"
import { PlusCircle, ChevronDown } from "lucide-react"

const NODE_TYPES = [
  { type: "task", label: "Task" },
  { type: "condition", label: "Condition" },
  { type: "notification", label: "Notification" },
]

const AddNodePanel: React.FC = () => {
  const { addNode } = useWorkflow()
  const [isOpen, setIsOpen] = useState(false)

  const handleAddNode = (type: string) => {
    addNode(type, { x: 100, y: 100 })
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left z-10">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Node
          <ChevronDown size={20} className="ml-2" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {NODE_TYPES.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => handleAddNode(nodeType.type)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                role="menuitem"
              >
                {nodeType.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AddNodePanel