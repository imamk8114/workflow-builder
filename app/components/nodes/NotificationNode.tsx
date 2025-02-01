import { memo } from "react"
import { Handle, Position } from "reactflow"

const NotificationNode = ({ data }: { data: { label: string } }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
    <div className="flex">
      <div className="rounded-full w-12 h-12 flex justify-center items-center bg-stone-100">🔔</div>
      <div className="ml-2">
        <div className="text-lg font-bold">{data.label}</div>
        <div className="text-gray-500">Notification</div>
      </div>
    </div>

    <Handle type="target" position={Position.Left} style={{ left: -8, top: "50%", background: "#10B981" }} />
    <Handle type="source" position={Position.Right} style={{ right: -8, top: "50%", background: "#10B981" }} />
  </div>
)

export default memo(NotificationNode)

