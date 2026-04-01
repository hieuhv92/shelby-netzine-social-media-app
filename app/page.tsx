import Sidebar from "./components/Sidebar";
import PostFeed from "./components/PostFeed";
import Widgets from "./components/Widgets";
import SignUpPrompt from "./components/SignUpPrompt";
import CommentModal from "./components/Modals/CommentModal";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-[1300px] mx-auto flex">
        {/* Column 1: Sidebar */}
        <Sidebar />

        {/* Column 2: PostFeed */}
        <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full 
             ml-[80px] xl:ml-[370px]">

          <PostFeed />
        </div>

        {/* Column 3: Widgets */}
        <div className="hidden lg:inline ml-8 flex-grow max-w-[350px]">
          <Widgets />
        </div>

      </main>
      {/* <SignUpPrompt /> */}
      {/* <CommentModal /> */}
    </div>
  );
}
