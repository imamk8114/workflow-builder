"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { useWorkflow } from "../contexts/WorkflowContext"

const NodeConfigPanel: React.FC = () => {
  const { selectedNode, updateNode, setIsEditing } = useWorkflow()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: selectedNode?.data || {},
  })

  useEffect(() => {
    reset(selectedNode?.data || {})
  }, [selectedNode, reset])

  const onSubmit = (data: any) => {
    if (selectedNode) {
      updateNode(selectedNode.id, data)
    }
  }

  if (!selectedNode) {
    return <p className="text-gray-500 dark:text-gray-400 italic">Select a node to configure</p>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Configure {selectedNode.type} Node</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Node Name</label>
          <Controller
            name="label"
            control={control}
            rules={{ required: "Node name is required" }}
            render={({ field }) => (
              <input
                {...field}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                rows={3}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
          />
        </div>
        {selectedNode.type === "task" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assignee</label>
              <Controller
                name="assignee"
                control={control}
                rules={{ required: "Assignee is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <Controller
                name="dueDate"
                control={control}
                rules={{ required: "Due date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      type="date"
                      {...field}
                      onFocus={() => setIsEditing(true)}
                      onBlur={() => setIsEditing(false)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </>
                )}
              />
            </div>
          </>
        )}
        {selectedNode.type === "condition" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Condition</label>
            <Controller
              name="condition"
              control={control}
              rules={{ required: "Condition is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    {...field}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  />
                  {error && <span className="text-red-500 text-sm">{error.message}</span>}
                </>
              )}
            />
          </div>
        )}
        {selectedNode.type === "notification" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <Controller
              name="message"
              control={control}
              rules={{ required: "Message is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <textarea
                    {...field}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    rows={3}
                  />
                  {error && <span className="text-red-500 text-sm">{error.message}</span>}
                </>
              )}
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Update Node
        </button>
      </form>
    </div>
  )
}

export default NodeConfigPanel