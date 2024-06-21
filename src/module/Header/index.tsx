/* eslint-disable @next/next/no-img-element */
/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useState, useEffect } from "react";
import {
  Popover,
  Transition,
  PopoverGroup,
  PopoverPanel,
  PopoverButton,
} from "@headlessui/react";
import {
  Popover as PopoverShad,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import InfoIcon from "@mui/icons-material/Info";
import CallIcon from "@mui/icons-material/Call";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuthContext } from "@/provider/auth.provider";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../module/AxiosCustom/custome_Axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCartContext } from "@/provider/cart.provider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const solutions = [
  {
    name: "Home",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Menu",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "/Menu",
    icon: MenuOpenIcon,
  },
  {
    name: "About",
    description: "Your customers' data will be safe and secure.",
    href: "/About",
    icon: InfoIcon,
  },
  {
    name: "Contact",
    description: "Connect with third-party tools that you're already using.",
    href: "/Contact",
    icon: CallIcon,
  },
  {
    name: "Cart",
    description: "Connect with third-party tools that you're already using.",
    href: "/Cart",
    icon: ShoppingCartIcon,
  },
];

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

function formatString(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export default function Header() {
  const authenContext = useAuthContext();
  const { user, isAuthenticated, logout } = authenContext;
  const { totalKiot, totalOnline } = useCartContext();
  const [listKey, setListKey] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [listNoti, setListNoti] = useState<any[]>([]);

  const [keyWord, setKeyWord] = useState<string>(
    searchParams.get("keyword") || ""
  );
  const params = useParams();
  const [typeSearch, setTypeSearch] = useState<string>(
    params?.idOfShop ? "inShop" : "inAll"
  );

  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      let dataKeys: any = await axios
        .get(`searches`, {
          params: {
            filter: {
              order: "updatedAt DESC",
              limit: 5,
            },
          },
        })
        .then((res) => res)
        .catch((err) => console.log(err));

      setListKey(dataKeys);

      const res: any = await axios
        .get(`notifications`, {
          params: {
            filter: {
              order: "createdAt DESC",
              limit: 5,
              where: {
                idOfUser: user?.id,
              },
            },
          },
        })
        .then((res) => res.data)
        .catch((e) => console.log(e));
      setListNoti(res);
    }

    fetchData();
  }, [user?.id]);

  return (
    <Popover className="relative bg-white z-20 ">
      <div className="bg-green-500  fixed top-0 right-0 left-0 ">
        <div className="mx-auto z-10 w-full  md:w-2/3">
          <div className="flex flex-row justify-between mt-2 text-white">
            <div className="flex flex-row items-center">
              <div
                className="hover:cursor-grab hover:text-gray-200 text-sm pr-2 border-r-[1px] border-gray-300"
                onClick={() => {
                  router.push(`createShop`);
                }}
              >
                Kenh nguoi ban
              </div>{" "}
              <div
                className="hover:cursor-grab hover:text-gray-200 text-sm pl-2"
                onClick={() => {
                  router.push(`https://www.facebook.com/hung131119782002`);
                }}
              >
                Ket noi
                <FacebookIcon className="ml-2" />
              </div>
            </div>

            <div className="flex flex-row justify-end items-center">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="text-sm mr-6 flex flex-row  items-center hover:cursor-grab">
                    <NotificationsIcon /> Thong bao
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit">
                  {isAuthenticated ? (
                    <>
                      <div>
                        {listNoti &&
                          listNoti?.map((item: any) => {
                            return (
                              <div
                                onClick={() => {
                                  if (!item?.idOfOrder.includes("VNP")) {
                                    router.push(
                                      `/user/purchase/order/${item?.idOfOrder}`
                                    );
                                  } else {
                                    router.push(
                                      `/user/wallet/rechargesuccess?${
                                        item?.idOfOrder.split("-")[1]
                                      }`
                                    );
                                  }
                                }}
                                key={item?.id}
                                className="px-4 py-4 border-b-[1px] border-gray-200 hover:cursor-pointer w-[500px] hover:bg-gray-100 flex flex-row justify-between"
                              >
                                <div className="flex flex-row gap-x-4 ">
                                  <img
                                    src={
                                      item?.image?.url ||
                                      "https://nld.mediacdn.vn/291774122806476800/2022/12/28/avatar-the-way-of-water-1670943667-1672220380184583234571.jpeg"
                                    }
                                    alt="img"
                                    className="w-20 h-20"
                                  />
                                  <div className="flex flex-col">
                                    <div className="">{item?.title}</div>
                                    <div className="text-sm font-light mt-2">
                                      {formatString(item?.content, 150)}
                                    </div>
                                    <div className="text-sm font-light mt-1">
                                      {formatDate(item?.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                      <div
                        className="w-full flex justify-center items-center py-2 hover:cursor-grab hover:bg-gray-100"
                        onClick={() => {
                          router.push(`user/notification/order`);
                        }}
                      >
                        Xem chi tiet{" "}
                      </div>
                    </>
                  ) : (
                    <div>Dang nhap de xem thong bao</div>
                  )}
                </HoverCardContent>
              </HoverCard>

              {!isAuthenticated && (
                <div className="flex flex-row gap-x-2 text-sm">
                  <div
                    className="px-2 border-r-[1px] border-gray-300 hover:underline hover:cursor-grab"
                    onClick={() => {
                      router.push("/Login");
                    }}
                  >
                    Dang nhap
                  </div>
                  <div
                    className="hover:underline hover:cursor-grab"
                    onClick={() => {
                      router.push("/Register");
                    }}
                  >
                    Dang ky
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex flex-row gap-x-2 justify-center items-center mr-4 hover:cursor-grab">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user?.avatar?.url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        {user?.fullName || user?.id}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit">
                    <div className="flex flex-col">
                      <div
                        className="py-2 px-4 hover:cursor-grab hover:bg-gray-200 border-b-[1px] border-gray-200"
                        onClick={() => {
                          router.push("user/account/profile");
                        }}
                      >
                        Thong tin tai khoan
                      </div>
                      <div
                        className="py-2 px-4 hover:cursor-grab hover:bg-gray-200 border-b-[1px] border-gray-200"
                        onClick={() => {
                          router.push("user/purchase");
                        }}
                      >
                        Don mua online
                      </div>
                      <div
                        className="py-2 px-4 hover:cursor-grab hover:bg-gray-200 border-b-[1px] border-gray-200"
                        onClick={() => {
                          localStorage.removeItem("user");
                          localStorage.removeItem("token");
                          logout();
                          router.push("/");
                        }}
                      >
                        Dang xuat
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-6 md:py-2 md:justify-start">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  <img
                    className="h-8 w-auto sm:h-10"
                    src="https://static.wixstatic.com/media/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png/v1/fill/w_320,h_320,q_90/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png"
                    alt=""
                  />
                  <span className="font-bold text-2xl px-2 text-white">
                    Luna Shop
                  </span>
                </div>
              </div>
            </div>
            <div className="-mr-2 -my-2 md:hidden">
              <PopoverButton className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open menu</span>
                <MenuOutlinedIcon />
              </PopoverButton>
            </div>
            <PopoverGroup
              as="nav"
              className="hidden md:flex md:flex-col space-x-10  w-[840px] pl-8 md:space-x-0 md:items-center"
            >
              <div className="flex flex-row items-center -space-x-[200px] w-full mt-4 mb-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 focus:outline-offset-4"
                  value={keyWord}
                  onChange={(e) => {
                    setKeyWord(e.target.value);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      const data = await axios
                        .post(`searches`, {
                          keyWord,
                        })
                        .then((res) => res)
                        .catch((e) => console.log(e));

                      if (params?.idOfShop) {
                        router.push(
                          `/shop/${params?.idOfShop}?keyword=${keyWord}`
                        );
                      } else {
                        router.push(`/search?keyword=${keyWord}`);
                      }
                    }
                  }}
                ></input>
                <div className="flex flex-row w-fit items-center gap-x-4">
                  <PopoverShad>
                    <PopoverTrigger>
                      <div className="flex flex-row">
                        <div className=" w-[125px] ">
                          {!params?.idOfShop
                            ? "Trong LunaShop"
                            : "Trong shop nay"}
                        </div>{" "}
                        <ExpandMoreIcon className="ml-1" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <div className=" flex flex-col gap-y-2 w-fit">
                        {params?.idOfShop && (
                          <>
                            <div className="py-2 px-4 flex flex-row gap-x-2 items-center hover:cursor-pointer hover:bg-gray-100">
                              Trong shop nay
                              <CheckIcon color="success" />
                            </div>
                            <div
                              className="py-2 px-4 hover:cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setTypeSearch("inAll");
                                router.push(`/search?keyword=${keyWord}`);
                              }}
                            >
                              Trong LunaShop
                            </div>
                          </>
                        )}
                        {!params?.idOfShop && (
                          <>
                            <div className="py-2 px-4 hover:cursor-pointer hover:bg-gray-100 flex flex-row gap-x-2 items-center">
                              Trong LunaShop
                              <CheckIcon color="success" />
                            </div>
                            <div
                              className="py-2 px-4 hover:cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setTypeSearch("inShop");
                              }}
                            >
                              Trong shop nay
                            </div>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </PopoverShad>

                  <SearchIcon className="" />
                </div>
              </div>
              <div className="text-white flex flex-row justify-start gap-x-3 w-full text-sm ">
                {Array.isArray(listKey) &&
                  listKey?.map((key: any) => (
                    <div
                      onClick={() => {
                        if (params?.idOfShop) {
                          router.push(
                            `/shop/${params?.idOfShop}?keyword=${key?.keyWord}`
                          );
                        } else {
                          router.push(`/search?keyword=${key?.keyWord}`);
                        }
                      }}
                      className="hover:underline hover:cursor-grab"
                      key={key.id}
                    >
                      {key.keyWord}
                    </div>
                  ))}
              </div>
            </PopoverGroup>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <p
                className="font-semibold mr-8 text-lg bg-gray-100 rounded-2xl hover:bg-blue-200  cursor-pointer"
                onClick={() => {}}
              >
                {/* {user?.fullName ? `Hello ${user?.fullName}` : ""} */}
              </p>
              <PopoverShad>
                <PopoverTrigger>
                  <div className="cursor-pointer  whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-3xl shadow-sm text-base font-medium text-white ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-9"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>

                    <div className="rounded-xl bg-red-600 px-2 absolute text-xs top-20 ml-7">
                      {totalOnline + totalKiot || 0}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="flex flex-col gap-y-2 w-fit">
                    <div
                      onClick={() => {
                        router.push("/cartOnline");
                      }}
                      className="flex flex-row justify-between items-center border-b-2 border-gray-300 pt-2 pb-4 hover:cursor-grab w-fit hover:bg-green-100"
                    >
                      <div>Gio hang Online - </div>
                      <div className="rounded-xl  px-2">{totalOnline || 0}</div>
                    </div>
                    <div
                      onClick={() => {
                        router.push("/cartKiot");
                      }}
                      className="flex flex-row justify-between items-center  pt-2 pb-2 w-full hover:cursor-grab hover:bg-green-100"
                    >
                      <div>Gio hang Kiot - </div>
                      <div className="rounded-xl  px-2">{totalKiot || 0}</div>
                    </div>
                  </div>
                </PopoverContent>
              </PopoverShad>
            </div>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <PopoverPanel
          focus
          className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden "
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <img
                    className="h-8 w-auto"
                    src="https://static.wixstatic.com/media/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png/v1/fill/w_320,h_320,q_90/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png"
                    alt="Luna"
                  />
                  <span className="font-bold text-2xl px-2 text-blue-600">
                    Luna Shop
                  </span>
                </div>
                <div className="-mr-2">
                  <PopoverButton className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <CloseIcon />
                  </PopoverButton>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  {solutions.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                    >
                      <item.icon
                        className="flex-shrink-0 h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                      />
                      <span className="ml-3 text-base font-medium text-gray-900">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div>
                <div
                  onClick={() => {
                    if (localStorage.getItem("user") === null) {
                    } else {
                      localStorage.removeItem("user");
                    }
                  }}
                  className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  {isAuthenticated ? "Logout" : "Signup"}
                </div>

                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  {isAuthenticated ? `Welcome` : "Existing customer ?"}
                  <div
                    onClick={() => {
                      if (localStorage.getItem("user") === null) {
                      } else {
                      }
                    }}
                    className="cursor-pointer text-indigo-600 hover:text-indigo-500"
                  >
                    {isAuthenticated ? ` ${user?.fullName}` : "Sign in "}
                  </div>
                </p>
              </div>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
