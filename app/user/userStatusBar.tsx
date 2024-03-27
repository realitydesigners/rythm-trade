export default function UserStatusBar() {
    return (
        <div className="fixed bottom-0 hidden h-8 w-full justify-end border border-t border-gray-700/50 pl-20 lg:flex ">
            <div className="flex items-center justify-center border-l border-gray-700/50 px-2">
                <span className="text-xs font-semibold uppercase text-gray-600">
                    NETWORK: GOOD
                </span>
            </div>
            <div className="flex items-center justify-center border-l border-gray-700/50 px-2">
                <svg
                    className="h-6 w-6 animate-pulse pr-2 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Circle</title>
                    <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
                <span className="text-xs font-semibold uppercase text-gray-600">
                    Operational
                </span>
            </div>
        </div>
    );
}
