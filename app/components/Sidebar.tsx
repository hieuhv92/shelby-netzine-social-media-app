import {
    HomeIcon,
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    UserIcon,
    EllipsisHorizontalCircleIcon
}
    from "@heroicons/react/24/outline";
import SidebarUserInfo from "./SidebarUserInfo";

// export default function Sidebar() {
//     return (
//         <nav className="h-screen flex flex-col sticky top-0 p-3 xl:ml-20 xl:mr-20 w-max">
//             <div className="relative h-full flex flex-col">
//                 <div className="py-3">
//                     <Logo className="w-10 h-10" />
//                 </div>
//                 <ul>
//                     <SidebarLink text="Home" Icon={HomeIcon} />
//                     <SidebarLink text="Explore" Icon={HashtagIcon} />
//                     <SidebarLink text="Notifications" Icon={BellIcon} />
//                     <SidebarLink text="More" Icon={EllipsisHorizontalCircleIcon} />
//                     <button className="hidden xl:block bg-[#F4AF01] w-[200px] h-[52px] 
//                     rounded-full text-white font-medium cursor-pointer shadow-md mt-2">
//                         POST
//                     </button>
//                 </ul>
//                 <SidebarUserInfo />
//             </div>
//         </nav >
//     )
// }

export default function Sidebar() {
    return (
        <nav className="h-screen flex flex-col fixed top-0 p-3 xl:ml-24 w-max z-50">
            <div className="relative h-full flex flex-col">
                <div className="py-3">
                    <Logo className="w-10 h-10" />
                </div>
                <ul className="flex-grow">
                    <SidebarLink text="Home" Icon={HomeIcon} />
                    <SidebarLink text="Explore" Icon={HashtagIcon} />
                    <SidebarLink text="Notifications" Icon={BellIcon} />
                    <SidebarLink text="More" Icon={EllipsisHorizontalCircleIcon} />
                    <button className="hidden xl:block bg-[#F4AF01] w-[200px] h-[52px] 
                    rounded-full text-white font-medium cursor-pointer shadow-md mt-4 hover:bg-[#d99b01] transition">
                        POST
                    </button>
                </ul>
                <div className="mt-auto">
                    <SidebarUserInfo />
                </div>
            </div>
        </nav>
    )
}

interface SidebarProps {
    text: string,
    Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
        title?: string;
        titleId?: string;
    } & React.RefAttributes<SVGSVGElement>>
}

function SidebarLink({ text, Icon }: SidebarProps) {
    return (
        <li className="flex items-center text-xl mb-2 space-x-3 p-2.5">
            <Icon className="h-7" />
            <span className="hidden xl:block">{text}</span>
        </li >
    )
}

const Logo = (props: { className?: string }) => {
    return (
        <svg
            className={props.className}
            xmlns="http://www.w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M22 12h-3M5 12H2" />
            <path d="M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12" />
        </svg>
    );
};
