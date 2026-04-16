import Sidebar from "@/components/navigation/Sidebar";
import HeaderInfo from "@/components/navigation/HeaderInfo";
import Widgets from "@/components/navigation/Widgets";
import CommentModal from "@/components/ui/modals/CommentModal";
import PostModal from "@/components/ui/modals/PostModal";
import EditProfileModal from "@/components/ui/modals/EditProfileModal";
import MobileNav from "@/components/navigation/MobileNav";

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
        <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full sm:ml-[80px] xl:ml-[370px] pb-16 sm:pb-0">
          <HeaderInfo />
          <div>{children}</div>
        </div>

        {/* Column 3: Widgets */}
        <aside className="hidden lg:block w-[400px]">
          <Widgets />
        </aside>
      </main >

      <MobileNav />

      {/* Modals Section */}
      < CommentModal />
      <PostModal />
      <EditProfileModal />
    </div >
  );
}
