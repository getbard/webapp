const SubscriptionRow = (): React.ReactElement => {
  return (
    <div className="border border-gray-200 rounded-sm p-4 mb-4">
      {/* Supporting since... */}
      <div className="bg-gray-200 h-6 w-64 mb-2"></div>

      {/* Amount Per Month */}
      <div className="bg-gray-200 h-6 w-40 mb-2"></div>

      {/* Next Charge */}
      <div className="bg-gray-200 h-6 w-56"></div>
    </div>
  );
}

const Subscriptions = (): React.ReactElement => {
  return (
    <div className="w-full">
      <SubscriptionRow />
      <SubscriptionRow />
      <SubscriptionRow />
      <SubscriptionRow />
    </div>
  );
}

export default Subscriptions;
