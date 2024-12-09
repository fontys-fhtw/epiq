import { STATUS_FLOW } from "@src/constants";

const OrderManagementHeader = () => {
  return (
    <div className="flex select-none items-center justify-center space-x-1 border-b border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200">
      {STATUS_FLOW.slice(0, 3).map((s, i) => (
        <div key={s.id} className="flex items-center space-x-1">
          <span
            className={`inline-block size-2 rounded-full ${s.color}`}
            title={s.name}
          />
          <span title={s.name}>{s.short}</span>
          {i < 2 && <span className="text-gray-500">→</span>}
        </div>
      ))}
      <span className="text-gray-500">→</span>
      <div className="flex items-center space-x-1">
        <span
          className={`inline-block size-2 rounded-full ${STATUS_FLOW[3].color}`}
          title="Completed"
        />
        <span title="Completed">{STATUS_FLOW[3].short}</span>
      </div>
      <span className="text-gray-500">/</span>
      <div className="flex items-center space-x-1">
        <span
          className={`inline-block size-2 rounded-full ${STATUS_FLOW[4].color}`}
          title="Cancelled"
        />
        <span title="Cancelled">{STATUS_FLOW[4].short}</span>
      </div>

      <span className="mx-2 text-gray-500">|</span>
      <span className="text-gray-300" title="Drag Handle Icon">
        ≡
      </span>
      <span
        className="text-gray-400"
        title="Drag orders to update their status"
      >
        Drag to move
      </span>
    </div>
  );
};

export default OrderManagementHeader;
