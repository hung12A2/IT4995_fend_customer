"use client";
import { cn } from "@/lib/utils";
import ChatIcon from "@mui/icons-material/Chat";
import { useEffect, useRef, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { socket } from "../socket/socket";
import axios from "../AxiosCustom/custome_Axios";
import { format, parseISO, set } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/provider/auth.provider";
import { useChatContext } from "@/provider/chat.provider";

function formatString(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export default function Chat() {
  const [openFormChat, setOpenFormChat] = useState(false);
  const { listConversation, listMsg, selectedConversation, setSelectedConversation} = useChatContext();
  const [inputMsg, setInputMsg] = useState("");
  const { user } = useAuthContext();

  const inputRef = useRef(null);

  return (
    <div>
      <div
        className={cn(
          "fixed bottom-0 right-12 px-6 py-2 text-white bg-green-600 hover:cursor-grab transition-all duration-100",
          openFormChat ? "opacity-0 invisible" : "opacity-100 visible"
        )}
        onClick={() => {
          setOpenFormChat(!openFormChat);
        }}
      >
        <ChatIcon fontSize="small" /> Chat
      </div>
      <div
        className={cn(
          "fixed bottom-0 z-10 right-12 pt-4 w-[640px]  bg-white  transition-all duration-100 flex flex-col",
          !openFormChat ? "opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        <div className="flex flex-row text-green-700 pl-8 pr-4 font-semibold justify-between w-full pb-2 border-b-[1px] border-gray-200">
          <div>CHAT</div>
          <div
            className="hover:cursor-grab"
            onClick={() => {
              setOpenFormChat(!openFormChat);
            }}
          >
            <ExpandMoreIcon />{" "}
          </div>
        </div>
        <div className="flex w-full flex-row">
          <div className="w-[223px]">
            {listConversation?.map((item: any) => {
              const shop = item?.shop;
              const formattedDate = format(parseISO(item?.createdAt), "dd/MM");

              return (
                <div
                  onClick={() => {
                    setSelectedConversation(item);
                    socket.emit(`inviteToRoom`, {
                      idOfUser: item?.idOfUser,
                      idOfShop: item?.idOfShop,
                    });

                    socket.emit(`joinConversation`, {
                      idOfUser: item?.idOfUser,
                      idOfShop: item?.idOfShop,
                    });
                  }}
                  className="flex flex-row items-center gap-x-2 px-2 py-3 hover:bg-gray-200 border-b-[1px] border-gray-200"
                  key={item?.id}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={shop?.avatar?.url} />
                    <AvatarFallback>HN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex flex-row gap-x-2">
                      <div className="font-medium">
                        {formatString(shop?.name, 10)}
                      </div>
                      <div> {formattedDate}</div>
                    </div>
                    <div className="font-light">
                      {" "}
                      {formatString(item?.lastMsg, 15)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-100 flex flex-col grow h-[412px] relative">
            {selectedConversation && (
              <div className="pl-4 w-full py-2 bg-white border-b-[1px] border-gray-200">
                {selectedConversation?.shop?.name}
              </div>
            )}

            {selectedConversation && (
              <div className="grow px-4 flex flex-col-reverse overflow-y-auto pb-[60px] gap-y-2">
                {listMsg?.map((item: any) => {
                  return (
                    <div
                      className={cn(
                        "flex flex-row gap-x-2",
                        item?.idOfUser == item?.senderId
                          ? "justify-end"
                          : "justify-start"
                      )}
                      key={item?.id}
                    >
                      <div
                        className={cn(
                          "px-2 py-1 bg-gray-200 rounded-lg flex flex-row gap-x-[6px]",
                          item?.idOfUser == item?.senderId ? "bg-cyan-200" : ""
                        )}
                      >
                        {item?.content}
                        <div className="text-xs flex justify-end	flex-col">
                          {format(parseISO(item?.createdAt || ""), "hh:mm")}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="text-sm px bg-green-600 text-white px-2">
                  LƯU Ý: Shopee KHÔNG cho phép các hành vi: Đặt cọc/Chuyển khoản
                  riêng cho người bán/Giao dịch ngoài hệ thống Shopee/Cung cấp
                  thông tin liên hệ cho người bán/Các hoạt động tuyển CTV/Tặng
                  quà miễn phí, ... Vui lòng chỉ mua-bán trực tiếp trên ứng dụng
                  Shopee để tránh nguy cơ bị lừa đảo bạn nhé!Tìm hiểu thêm
                </div>
                <div className="w-full flex item-center justify-center my-3">
                  {selectedConversation?.createdAt && (
                    <div className="text-xs text-gray-400">
                      {format(
                        parseISO(selectedConversation?.createdAt || ""),
                        "dd/MM"
                      ).replace("/", " thg ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedConversation && (
              <div className="h-full flex items-center justify-center">
                Chao mung ban den voi Luna Chat !
              </div>
            )}

            <input
              ref={inputRef}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              type="text"
              className="w-full px-2 pt-2 pb-4 bottom-0 focus:outline-none absolute "
              placeholder="Nhap noi dung tin nhan"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Handle the Enter key event here
                  setInputMsg("");
                  socket.emit("add-msg", {
                    idOfUser: selectedConversation?.idOfUser,
                    idOfShop: selectedConversation?.idOfShop,
                    content: inputMsg,
                    senderId: selectedConversation?.idOfUser,
                    targetId: selectedConversation?.idOfShop,
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
