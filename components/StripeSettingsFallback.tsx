const AccountSettingsFallback = (): React.ReactElement => {
  return (
    <div className="w-full border border-gray-200 rounded-sm p-4 shadow-sm">
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded-sm w-full py-2 px-3"></div>
        </div>

        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded-sm w-full py-2 px-3"></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-gray-200 h-10 w-20"></div>
          <div className="w-1/3 h-4 bg-gray-200 rounded-sm py-2 px-3"></div>
        </div>
    </div>
  );
}

export default AccountSettingsFallback;