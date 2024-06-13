import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/provider/auth.provider";
import EditIcon from "@mui/icons-material/Edit";
import Person2Icon from "@mui/icons-material/Person2";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import WalletIcon from '@mui/icons-material/Wallet';

export default function NavUser() {
  const { user } = useAuthContext();

  const router = useRouter();
  const link = window.location.pathname;

  console.log(link);

  return (
    <div className="mr-8">
      <div className="flex flex-row gap-x-4 justify-center ">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.avatar?.url} />
          <AvatarFallback>HN</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user?.fullName || "Hung Nguyen"}</div>
          <div
            className="flex flex-row gap-x-1 hover:cursor-grab"
            onClick={() => {
              router.push("/user/account/profile");
            }}
          >
            <EditIcon color="disabled" fontSize="small" />
            <div className="text-gray-500 w-[92px]">Sua ho so</div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-row gap-x-4">
        <div>
          <Person2Icon />{" "}
        </div>
        <div className="flex flex-col gap-y-4 py-1">
          <div>Tai khoan cua toi</div>
          <div className="ml-2 text-gray-600 gap-y-4 flex flex-col">
            <div
              className={cn(
                `hover:cursor-grab hover:text-green-600`,
                link == "/user/account/profile" && "text-green-600"
              )}
              onClick={() => {
                router.push("/user/account/profile");
              }}
            >
              Ho so
            </div>
            <div
              className={cn(
                `hover:cursor-grab hover:text-green-600`,
                link == "/user/account/address" && "text-green-600"
              )}
              onClick={() => {
                router.push("/user/account/address");
              }}
            >
              Dia chi
            </div>
            <div
              className={cn(
                `hover:cursor-grab hover:text-green-600`,
                link == "/user/account/password" && "text-green-600"
              )}
              onClick={() => {
                router.push("/user/account/password");
              }}
            >
              Doi mat khau
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-row gap-x-4">
        <div>
          <ListAltIcon />{" "}
        </div>
        <div className="text-gray-600 gap-y-4 flex flex-col">
          <div className={cn(`flex flex-col gap-y-4 py-1 `)}>
            <div> Don mua</div>
            <div className="ml-2 gap-y-4 flex flex-col">
              <div
                className={cn(
                  `hover:cursor-grab hover:text-green-600`,
                  link == "/user/purchase" && "text-green-600"
                )}
                onClick={() => {
                  router.push("/user/purchase");
                }}
              >
                Don mua online
              </div>
              <div
                className={cn(
                  `hover:cursor-grab hover:text-green-600`,
                  link == "/user/purchasekiot" && "text-green-600"
                )}
                onClick={() => {
                  router.push("/user/purchasekiot");
                }}
              >
                Don mua offline
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-row gap-x-4">
        <div>
          <NotificationsIcon />
        </div>
        <div className="text-gray-600 gap-y-4 flex flex-col">
          <div className={cn(`flex flex-col gap-y-4 py-1 `)}>
            <div>Thong bao</div>
            <div className="ml-2 gap-y-4 flex flex-col">
              <div
                className={cn(
                  `hover:cursor-grab hover:text-green-600`,
                  link == "/user/notification/order" && "text-green-600"
                )}
                onClick={() => {
                  router.push("/user/notification/order");
                }}
              >
                Don hang
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-row gap-x-4">
        <div>
          <WalletIcon />
        </div>
        <div className="text-gray-600 gap-y-4 flex flex-col">
          <div className={cn(`flex flex-col gap-y-4 py-1 `)}>
            <div>Vi tien</div>
            <div className="ml-2 gap-y-4 flex flex-col">
              <div
                className={cn(
                  `hover:cursor-grab hover:text-green-600`,
                  link == "/user/wallet/recharge" && "text-green-600"
                )}
                onClick={() => {
                  router.push("/user/wallet/recharge");
                }}
              >
              Nap tien 
              </div>
              <div
                className={cn(
                  `hover:cursor-grab hover:text-green-600`,
                  link == "/user/wallet/transaction" && "text-green-600"
                )}
                onClick={() => {
                  router.push("/user/wallet/transaction");
                }}
              >
                Danh sach giao dich
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
