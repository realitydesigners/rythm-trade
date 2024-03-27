import UserNavigation from "./userNavigation";
import UserStatusBar from "./userStatusBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <>
            <UserNavigation />
            {children}
            <UserStatusBar />
        </>
    );
}
