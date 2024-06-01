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
import { useRouter } from "next/navigation";
import { useCartContext } from "@/provider/cart.provider";

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

export default function Header() {
  const authenContext = useAuthContext();
  const { user, isAuthenticated } = authenContext;
  const { totalKiot, totalOnline } = useCartContext();
  const [listKey, setListKey] = useState<any[]>([]);
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
    }

    fetchData();
  }, []);

  return (
    <Popover className="relative bg-white z-20 ">
      <div className="bg-green-500  fixed top-0 right-0 left-0 ">
        <div className="mx-auto z-10 w-full  md:w-2/3">
          <div className="flex justify-between items-center py-6 md:py-2 md:justify-start">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <div className="cursor-pointer flex items-center">
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
              className="hidden md:flex md:flex-col space-x-10  w-1/2 md:space-x-0 md:items-center"
            >
              <div className="flex flex-row items-center -space-x-8 w-full mt-4 mb-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 focus:outline-offset-4"
                ></input>
                <SearchIcon className="" />
              </div>
              <div className="text-white flex flex-row justify-start gap-x-3 w-full text-sm ">
                {Array.isArray(listKey) &&
                  listKey?.map((key: any) => (
                    <div
                      onClick={() => {
                        router.push(`/search?keyword=${key.keyWord}`);
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
                  <div className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-3xl shadow-sm text-base font-medium text-white ">
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

                    <div className="rounded-xl bg-red-600 px-2 absolute text-xs top-8 ml-7">
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

              <div
                className="cursor-pointer ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-3xl shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (isAuthenticated) {
                    console.log("logout");
                  } else {
                    console.log("login");
                  }
                }}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </div>
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
