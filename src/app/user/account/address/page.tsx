"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddIcon from "@mui/icons-material/Add";
import { use, useEffect, useState } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import {
  CheckedField,
  SelectField,
  TextField,
} from "../../../../module/base/fieldBase";
import axios from "../../../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer from "@/module/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/module/Header";
import { useAuthContext } from "@/provider/auth.provider";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import Person2Icon from "@mui/icons-material/Person2";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function LocationCard({}: {}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [location, setLocation] = useState<any>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<string>("");
  const [listProvince, setListProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const router = useRouter();
  const { user } = useAuthContext();

  const formContext = useForm({});
  const { handleSubmit } = formContext;
  let formUpdateContext = useForm({});
  const { handleSubmit: handleSubmitUpdate, setValue: setValueUpdate } =
    formUpdateContext;

  useEffect(() => {
    async function fetchData() {
      const dataLocation: any = await axios
        .get(`location-users`, {
          params: {
            filter: {
              isDefaultKiot: true,
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      setLocation(dataLocation);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProvince() {
      let res: any = await axios
        .post(`/location/province`)
        .then((res) => res.data)
        .catch((e) => console.log(e));

      res = res.map((item: any) => {
        return {
          value: `${item.provinceName}-${item.provinceId}`,
          label: item.provinceName,
        };
      });

      setListProvince(res);
    }

    fetchProvince();
  }, []);

  useEffect(() => {
    async function fetchDistrict() {
      let res: any = await axios
        .post(`/location/district/${selectedProvince?.split("-")[1]}`)
        .then((res) => res.data)
        .catch((e) => console.log(e));

      res = res.map((item: any) => {
        return {
          value: `${item.districtName}-${item.districtId}`,
          label: item.districtName,
        };
      });

      setListDistrict(res);
    }

    fetchDistrict();
  }, [selectedProvince]);

  useEffect(() => {
    async function fetchWard() {
      let res: any = await axios
        .post(`/location/ward/${selectedDistrict?.split("-")[1]}`)
        .then((res) => res.data)
        .catch((e) => console.log(e));

      res = res?.map((item: any) => {
        return {
          value: `${item.wardName}-${item.wardCode}`,
          label: item.wardName,
        };
      });

      setListWard(res);
    }

    fetchWard();
  }, [selectedDistrict]);

  useEffect(() => {
    const updateLocation = location?.filter(
      (item: any) => item.id == selectedUpdate
    )[0];

    setValueUpdate("address", updateLocation?.address);
    setValueUpdate("phoneNumber", updateLocation?.phoneNumber);
    setValueUpdate("province", {
      value: `${updateLocation?.provinceName}-${updateLocation?.provinceId}`,
      label: updateLocation?.provinceName,
    });
    setValueUpdate("district", {
      value: `${updateLocation?.districtName}-${updateLocation?.districtId}`,
      label: updateLocation?.districtName,
    });
    setValueUpdate("ward", {
      value: `${updateLocation?.wardName}-${updateLocation?.wardCode}`,
      label: updateLocation?.wardName,
    });
    setValueUpdate("isDefaultKiot", updateLocation?.isDefaultKiot);
    setValueUpdate("isDefaultOnline", updateLocation?.isDefaultOnline);
  }, [selectedUpdate, location, formUpdateContext, setValueUpdate]);

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Header />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <div className="mr-8">
          <div className="flex flex-row gap-x-4 justify-center ">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar?.url} />
              <AvatarFallback>HN</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user?.fullName || "Hung Nguyen"}
              </div>
              <div className="flex flex-row gap-x-1">
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
                <div className="hover:cursor-grab hover:text-green-600" onClick={() =>{
                    router.push("/user/account/profile")
                }}>Ho so</div>
                <div
                  className="hover:cursor-grab text-green-600"
                  onClick={() => {
                    router.push("/user/account/address");
                  }}
                >
                  Dia chi
                </div>
                <div className="hover:cursor-grab hover:text-green-600"   onClick={() => {
                    router.push("/user/account/password");
                  }}>
                  Doi mat khau
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-row gap-x-4">
            <div>
              <ListAltIcon />{" "}
            </div>
            <div className="flex flex-col gap-y-4 py-1 hover:cursor-grab hover:text-green-600">
              Don mua
            </div>
          </div>
          <div className="mt-2 flex flex-row gap-x-4">
            <div>
              <NotificationsIcon />{" "}
            </div>
            <div className="flex flex-col gap-y-4 py-1 hover:cursor-grab hover:text-green-600">
              Thong bao
            </div>
          </div>
        </div>
        <div className="bg-white py-6 pr-8 pl-8 flex flex-col w-full">
          <>
            <Dialog open={openAddForm} onOpenChange={setOpenAddForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dia chi moi</DialogTitle>
                </DialogHeader>

                <FormProvider {...formContext}>
                  <div className="mb-4">
                    <TextField
                      name="address"
                      label="Address"
                      placeholder="Address"
                      required={true}
                    />
                  </div>
                  <div className="mb-4 ">
                    <TextField
                      required={true}
                      name="phoneNumber"
                      label="PhoneNumber"
                      placeholder="PhoneNumber"
                    />
                  </div>
                  <div>
                    <SelectField
                      setSelected={(value: any) => {
                        setSelectedProvince(value);
                      }}
                      name="province"
                      label="province"
                      options={listProvince}
                    />
                  </div>
                  <div>
                    <SelectField
                      setSelected={(value: any) => {
                        setSelectedDistrict(value);
                      }}
                      name="district"
                      label="district"
                      options={listDistrict}
                    />
                  </div>
                  <div>
                    <SelectField name="ward" label="ward" options={listWard} />
                  </div>
                  <div>
                    <CheckedField
                      name="isDefaultKiot"
                      label="Dia chi mac dinh giao hoa toc"
                    />
                  </div>
                  <div>
                    <CheckedField
                      name="isDefaultOnline"
                      label="Dia chi mac dinh giao online"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit(async (data) => {
                      let province = data.province.value;
                      let district = data.district.value;
                      let ward = data.ward.value;
                      const dataReturn: any = await axios.post(
                        `/location-users/create`,
                        {
                          ...data,
                          province,
                          district,
                          ward,
                        }
                      );

                      if (dataReturn.code == 200) {
                        setLocation((prev: any) => {
                          return [...prev, dataReturn.data];
                        });
                        toast({
                          title: " Them dia chi thanh cong",
                        });
                      } else {
                        toast({
                          title: " Them dia chi that bai",
                        });
                      }

                      setOpenAddForm(false);
                    })}
                  >
                    Submit
                  </Button>
                </FormProvider>
              </DialogContent>
            </Dialog>
            <Dialog open={openUpdateForm} onOpenChange={setOpenUpdateForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cap nhap dia chi</DialogTitle>
                </DialogHeader>

                <FormProvider {...formUpdateContext}>
                  <div className="mb-4">
                    <TextField
                      name="address"
                      label="Address"
                      placeholder="Address"
                      required={true}
                    />
                  </div>
                  <div className="mb-4 ">
                    <TextField
                      required={true}
                      name="phoneNumber"
                      label="PhoneNumber"
                      placeholder="PhoneNumber"
                    />
                  </div>
                  <div>
                    <SelectField
                      setSelected={(value: any) => {
                        setSelectedProvince(value);
                      }}
                      name="province"
                      label="province"
                      options={listProvince}
                    />
                  </div>
                  <div>
                    <SelectField
                      setSelected={(value: any) => {
                        setSelectedDistrict(value);
                      }}
                      name="district"
                      label="district"
                      options={listDistrict}
                    />
                  </div>
                  <div>
                    <SelectField name="ward" label="ward" options={listWard} />
                  </div>
                  <div>
                    <CheckedField
                      name="isDefaultKiot"
                      label="Dia chi mac dinh giao hoa toc"
                    />
                  </div>
                  <div>
                    <CheckedField
                      name="isDefaultOnline"
                      label="Dia chi mac dinh giao online"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitUpdate(async (data) => {
                      let province = data.province.value;
                      let district = data.district.value;
                      let ward = data.ward.value;
                      const dataReturn: any = await axios.post(
                        `/location-users/update/${selectedUpdate}`,
                        {
                          ...data,
                          province,
                          district,
                          ward,
                        }
                      );

                      if (dataReturn.code == 200) {
                        setLocation((prev: any) => {
                          return prev.map((item: any) => {
                            if (item.id == selectedUpdate) {
                              return dataReturn.data;
                            } else {
                              return item;
                            }
                          });
                        });
                        toast({
                          title: "Cap nhap dia chi thanh cong",
                        });
                      } else {
                        toast({
                          title: "Cap nhap dia chi that bai",
                        });
                      }

                      setOpenUpdateForm(false);
                    })}
                  >
                    Submit
                  </Button>
                </FormProvider>
              </DialogContent>
            </Dialog>

            <div className="text-lg border-b-[1px] pb-6 border-gray-300 w-full flex flex-row justify-between">
              <div>Dia chi cua toi</div>
              <div
                className="hover:cursor-grab mt-4 text-lg text-green-600 pr-4 pl-2 py-2 border-[1px] border-green-600 w-fit"
                onClick={() => {
                  setOpen(false);
                  setOpenAddForm(true);
                }}
              >
                <AddIcon />
                Them dia chi moi
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-4">Dia chi</div>
              {location?.map((item: any, index: number) => (
                <div
                  className={`grid grid-cols-9 py-4 border-gray-300 w-full ${
                    index !== location.length - 1 && "border-b-2"
                  }`}
                  key={item.id}
                >
                  <div className="col-span-7 flex flex-col">
                    <div className="flex flex-row">
                      <div className="text-base font-medium	 pr-3 border-r-2 border-gray-400">
                        {item?.name ? item?.name : "Hung Nguyen"}
                      </div>
                      <div className="pl-3">{item?.phoneNumber}</div>
                    </div>
                    <div className="text-sm font-light pr-2 mt-2">
                      {item?.address}, {item?.wardName}, {item?.districtName},{" "}
                      {item?.provinceName}
                    </div>
                    {item?.isDefaultKiot && (
                      <div className="text-sm font-light mt-2 border-2 border-green-600 w-fit text-green-600 px-2 py-1 ">
                        Dia chi mac dinh giao hoa toc
                      </div>
                    )}
                    {item?.isDefaultOnline && (
                      <div className="text-sm font-light mt-2 border-2 border-green-600 w-fit text-green-600 px-2 py-1 ">
                        Dia chi mac dinh giao online
                      </div>
                    )}
                  </div>

                  <div
                    className="col-span-1 underline text-green-600 hover:cursor-grab"
                    onClick={() => {
                      setSelectedUpdate(item?.id);
                      setOpenUpdateForm(true);
                      setOpen(false);
                    }}
                  >
                    Cap nhap
                  </div>
                  <div className="col-span-1 underline text-green-600  hover:cursor-grab">
                    Xoa
                  </div>
                </div>
              ))}
            </div>
          </>
        </div>
      </div>
      <Footer />
    </div>
  );
}
