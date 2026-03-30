import Sidebar from "./components/Sidebar";
import PostFeed from "./components/PostFeed";
import Widgets from "./components/Widgets";
import SignUpPrompt from "./components/SignUpPrompt";
import CommentModal from "./components/Modals/CommentModal";

// export default function Home() {
//   return (
//     <>
//       <div className="min-h-screen max-w-[1400px] mx-auto flex justify-end text[#)=0F1419]">
//         <Sidebar />
//         <PostFeed />
//         <Widgets />
//       </div>
//       {/* <SignUpPrompt /> */}
//       <CommentModal />
//     </>
//   );
// }

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-[1300px] mx-auto flex">

        {/* Cột 1: Sidebar đã fixed, không chiếm diện tích ngang */}
        <Sidebar />

        {/* Cột 2: PostFeed - Cần đẩy lề để không bị Sidebar đè lên */}
        <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full 
             ml-[80px] xl:ml-[370px]">
          {/* ml-80px cho icon sidebar, 370px cho sidebar có chữ + margin-24 */}

          <PostFeed />
        </div>

        {/* Cột 3: Widgets */}
        <div className="hidden lg:inline ml-8 flex-grow max-w-[350px]">
          <Widgets />
        </div>

      </main>
      <CommentModal />
    </div>
  );
}
