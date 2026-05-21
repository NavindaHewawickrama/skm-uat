export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
            <main className="flex flex-1 overflow-hidden">{children}</main>
        </div>
    );
}
