import Sidebar from "@/components/navigation/Sidebar";
import Widgets from "@/components/navigation/Widgets";
import CommentModal from "@/components/ui/modals/CommentModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-[1300px] mx-auto flex">
        {/* Column 1: Sidebar */}
        <Sidebar />

        {/* Column 2: Dynamic Content(Feed, Post Detail, Profile, v.v.) */}
        <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full 
             ml-[80px] xl:ml-[370px]">
          {children}
        </div>

        {/* Column 3: Widgets */}
        <div className="hidden lg:inline ml-8 flex-grow max-w-[350px]">
          <Widgets />
        </div>
      </main>

      {/* Common Modals */}
      <CommentModal />
    </div>
  );
}