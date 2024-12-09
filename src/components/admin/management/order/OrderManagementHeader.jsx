import {
  ORDER_STATUS_ID,
  ORDER_STATUS_ID_TO_COLOR,
  ORDER_STATUS_ID_TO_SHORT,
  ORDER_STATUS_ID_TO_TEXT,
} from "@src/constants";

const OrderManagementHeader = () => {
  const BASIC_ORDER_IDS = [
    ORDER_STATUS_ID.SUBMITTED,
    ORDER_STATUS_ID.IN_PROGRESS,
    ORDER_STATUS_ID.READY_FOR_PICK_UP,
  ];

  return (
    <div className="flex select-none items-center justify-center space-x-1 border-b border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200">
      {BASIC_ORDER_IDS.map((statusId, i) => (
        <div key={statusId} className="flex items-center space-x-1">
          <span
            className={`inline-block size-2 rounded-full ${ORDER_STATUS_ID_TO_COLOR[statusId]}`}
            title={ORDER_STATUS_ID_TO_TEXT[statusId]}
          />
          <span title={ORDER_STATUS_ID_TO_TEXT[statusId]}>
            {ORDER_STATUS_ID_TO_SHORT[statusId]}
          </span>
          {i < 2 && <span className="text-gray-500">→</span>}
        </div>
      ))}
      <span className="text-gray-500">→</span>
      <div className="flex items-center space-x-1">
        <span
          className={`inline-block size-2 rounded-full ${ORDER_STATUS_ID_TO_COLOR[ORDER_STATUS_ID.COMPLETED]}`}
          title="Completed"
        />
        <span title="Completed">
          {ORDER_STATUS_ID_TO_SHORT[ORDER_STATUS_ID.COMPLETED]}
        </span>
      </div>
      <span className="text-gray-500">/</span>
      <div className="flex items-center space-x-1">
        <span
          className={`inline-block size-2 rounded-full ${ORDER_STATUS_ID_TO_COLOR[ORDER_STATUS_ID.CANCELLED]}`}
          title="Cancelled"
        />
        <span title="Cancelled">
          {ORDER_STATUS_ID_TO_SHORT[ORDER_STATUS_ID.CANCELLED]}
        </span>
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
