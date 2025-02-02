import { memo } from "react"
import { Handle, Position } from "reactflow"
import { useTheme } from "../../contexts/ThemeContext"

const TaskNode = ({ data }: { data: { label: string; description: string; status: string } }) => {
  const { theme } = useTheme()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg w-48 h-36">
      <div className="flex items-center justify-between mb-2">
        <div className="rounded-lg w-10 h-10 flex justify-center items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
          📋
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)} text-white`}>
          {data.status}
        </div>
      </div>
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{data.label}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Task</p>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{data.description}</p>

      <Handle
        type="target"
        position={Position.Left}
        style={{ left: -8, width: 16, height: 16, background: theme === "dark" ? "#4F46E5" : "#3730A3" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ right: -8, width: 16, height: 16, background: theme === "dark" ? "#4F46E5" : "#3730A3" }}
      />
    </div>
  )
}

export default memo(TaskNode)