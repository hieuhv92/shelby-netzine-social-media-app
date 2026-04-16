import SideNav from "@/components/navigation/SideNav";
import MainHeader from "@/components/navigation/MainHeader";
import RightSidebar from "@/components/navigation/RightSidebar";
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
        {/* Column 1: SideNav */}
        <SideNav />

        {/* Column 2: Dynamic Content(Feed, Post Detail, Profile, v.v.) */}
        <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full sm:ml-[80px] xl:ml-[370px] pb-16 sm:pb-0">
          <MainHeader />
          <div>{children}</div>
        </div>

        {/* Column 3: RightSidebar */}
        <aside className="hidden lg:block w-[400px]">
          <RightSidebar />
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
