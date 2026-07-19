import React, { useEffect } from "react";
import {
  Coins,
  LogOut,
  MessageSquare,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Plus,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../features/getConversations";
import {
  addConversations,
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";
import logout from "../features/logout";
import { setUserData } from "../redux/userSlice";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();

      console.log("API Response:", data);
      console.log("Is Array:", Array.isArray(data));

      dispatch(setConversations(data));
    };
    getConv();
  }, [userData?._id]);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversations(data));
  };

if (collapsed) {
  return (
    <div className="hidden lg:flex flex-col items-center w-16 h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-2">
      {/* Expand Sidebar */}
      <button
        aria-label="Expand Sidebar"
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-150 cursor-pointer"
      >
        <PanelRight size={17} />
      </button>

      {/* New Chat */}
      <button
        aria-label="New Chat"
        onClick={handleCreateConversation}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-150 cursor-pointer"
        onClick={()=>dispatch(setSelectedConversation(null))}
      >
        <Plus size={16} />
      </button>

      {/* Conversations */}
      <div className="flex-1 w-full overflow-y-auto pt-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {conversations.map((conv) => {
          const isActive = selectedConversation?._id === conv._id;

          return (
            <div
              key={conv._id}
              title={conv.title || "New Chat"}
              onClick={() => dispatch(setSelectedConversation(conv))}
              className={`flex justify-center items-center w-10 h-10 mx-auto mb-1 rounded-xl cursor-pointer transition-all duration-150 ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-400"
                  : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
              }`}
            >
              <MessageSquare size={16} />
            </div>
          );
        })}
      </div>

      {/* User */}
      <div className="pb-2 flex justify-center">
        {userData?.avatar && !imageError ? (
          <img
            src={userData.avatar}
            alt="User"
            onError={() => setImageError(true)}
            className="w-9 h-9 rounded-xl object-cover border-2 border-indigo-500/25 cursor-pointer transition-transform duration-150 hover:scale-105"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center cursor-pointer hover:bg-white/[0.08] transition-colors">
            <User size={15} className="text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
}

  return (
   <div className="fixed inset-y-0 left-0 z-50 hidden h-screen w-[280px] shrink-0 border-r border-white/[0.06] bg-[#0d0f14] lg:static lg:flex">
  <div className="flex h-full w-full flex-col">
    {/* Header */}
    <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-4">
      <button
        aria-label="Collapse Sidebar"
        onClick={() => setCollapsed(true)}
        className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all duration-150 hover:bg-white/[0.05] hover:text-slate-200 lg:flex"
      >
        <PanelLeftIcon size={18} />
      </button>

      <span className="flex-1 text-[16px] font-semibold tracking-tight text-slate-100">
        NexusAI
      </span>

      <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-indigo-400">
        Free
      </span>

      <button
        aria-label="New Chat"
        // onClick={handleCreateConversation}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all duration-150 hover:bg-white/[0.05] hover:text-slate-200 active:scale-95"
        onClick={()=>dispatch(setSelectedConversation(null))}
      >
        <PenSquare size={15} />
      </button>
    </div>

    {/* New Chat */}
    <div className="px-4 pt-4 pb-2">
      <button
        // onClick={handleCreateConversation}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-700 py-[11px] text-sm font-medium text-white transition-all duration-150 hover:opacity-95 active:scale-[0.98]"
        onClick={()=>dispatch(setSelectedConversation(null))}
      >
        <Plus size={15} />
        New Chat
      </button>
    </div>

    {/* Section */}
    <div className="px-5 pt-4 pb-2 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
      {conversations.length === 0
        ? "No Recent Conversations"
        : "Recents"}
    </div>

    {/* Conversation List */}
    <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {conversations.map((conv) => {
        const isActive = selectedConversation?._id === conv._id;

        return (
          <div
            key={conv._id}
            title={conv.title || "New Chat"}
            onClick={() => dispatch(setSelectedConversation(conv))}
            className={`mb-1 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-150 ${
              isActive
                ? "border-indigo-500/30 bg-indigo-500/15"
                : "border-transparent hover:bg-white/[0.05]"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "bg-white/[0.05] text-slate-500"
              }`}
            >
              <MessageSquare size={15} />
            </div>

            <span
              title={conv.title}
              className={`truncate text-[13px] font-medium ${
                isActive ? "text-slate-100" : "text-slate-300"
              }`}
            >
              {conv.title || "New Chat"}
            </span>
          </div>
        );
      })}
    </div>

    {/* Divider */}
    <div className="mx-3 h-px bg-white/[0.06]" />

    {/* User */}
    <div className="p-3.5">
      {userData ? (
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-white/[0.05]">
          <div className="shrink-0">
            {userData.avatar && !imageError ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                onError={() => setImageError(true)}
                className="h-10 w-10 rounded-xl border-2 border-indigo-500/25 object-cover transition-transform duration-150 hover:scale-105"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <User size={16} className="text-slate-400" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-slate-100">
              {userData.name || "User"}
            </p>
            <p className="text-[11px] text-slate-500">
              Free Plan
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              aria-label="Upgrade"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-500 transition-all duration-150 hover:bg-white/[0.08] hover:text-amber-400"
            >
              <Coins size={16} />
            </button>

            <button
              aria-label="Logout"
              onClick={() => {
                logout();
                dispatch(setUserData(null));
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-all duration-150 hover:bg-white/[0.08] hover:text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
          Login
        </button>
      )}
    </div>
  </div>
</div>
  );
};

export default Sidebar;
