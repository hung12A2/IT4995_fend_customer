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
import { CheckedField, SelectField, TextField } from "./fieldBase";
import axios from "../AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuthContext } from "@/provider/auth.provider";

export default function LocationCard({
  location = [],
  setLocation,
}: {
  location: any;
  setLocation: Function;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<string>("");
  const [listProvince, setListProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const {user, isAuthenticated} = useAuthContext();

  const formContext = useForm({});
  const { handleSubmit } = formContext;
  let formUpdateContext = useForm({});
  const { handleSubmit: handleSubmitUpdate, setValue: setValueUpdate } =
    formUpdateContext;

  location = Array.isArray(location) ? location : [];
  const locationKiotDefault = location.filter(
    (item: any) => item?.isDefaultKiot == true
  )[0] 

  const [selectedLocation, setSelectedLocation] =
    useState<any>(locationKiotDefault);

  const [selectedLocationId, setSelectedLocationId] = useState<any>(
    locationKiotDefault?.id
  );

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
      setSelectedLocation(locationKiotDefault);
      setSelectedLocationId(locationKiotDefault?.id);
    }

    fetchProvince();
  }, [locationKiotDefault]);

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
      value: `${updateLocation?.wardName}-${updateLocation?.wardId}`,
      label: updateLocation?.wardName,
    });
    setValueUpdate("name", updateLocation?.name);
    setValueUpdate("isDefaultKiot", updateLocation?.isDefaultKiot);
    setValueUpdate("isDefaultOnline", updateLocation?.isDefaultOnline);
  }, [selectedUpdate, location, formUpdateContext, setValueUpdate]);

  return (
    <>
      <Dialog open={openAddForm} onOpenChange={setOpenAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Địa chỉ mới</DialogTitle>
          </DialogHeader>

          <FormProvider {...formContext}>
            <div className="mb-4">
              <TextField
                name="name"
                label="Name"
                placeholder="Name"
                required={true}
              />
            </div>
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
                label="Địa chỉ mặc định giao hỏa tốc"
              />
            </div>
            <div>
              <CheckedField
                name="isDefaultOnline"
                label="Địa chỉ mặc định giao online"
              />
            </div>
            <Button
              onClick={handleSubmit(async (data) => {
                let province = data?.province.value;
                let district = data?.district.value;
                let ward = data?.ward.value;
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
            <DialogTitle>Cập nhập địa chỉ</DialogTitle>
          </DialogHeader>

          <FormProvider {...formUpdateContext}>
            <div className="mb-4">
              <TextField
                name="name"
                label="Name"
                placeholder="Name"
                required={true}
              />
            </div>
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
                label="Địa chỉ mặc định giao hỏa tốc"
              />
            </div>
            <div>
              <CheckedField
                name="isDefaultOnline"
                label="Địa chỉ mặc định giao online"
              />
            </div>
            <Button
              onClick={handleSubmitUpdate(async (data) => {
                let province = data?.province.value;
                let district = data?.district.value;
                let ward = data?.ward.value;
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
                    title: "Cập nhập địa chỉ thanh cong",
                  });
                } else {
                  toast({
                    title: "Cập nhập địa chỉ that bai",
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="border-[1px] px-2 py-1 rounded-sm border-green-600 hover:cursor-grab">
            {selectedLocation?.wardName || 'Thị trấn Thanh Thủy'},{selectedLocation?.districtName || 'Huyện Thanh Thủy'}
            <ExpandMoreIcon className="ml-2" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Địa chỉ của tôi</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <ScrollArea className="h-100 rounded-md ">
              <div className="mt-4">
                {/* {
                   && (
                    <div className="text-red-600 text-lg font-medium">
                      Vui lòng đăng nhập để chọn địa chỉ giao hàng
                    </div>
                  )
                } */}
                <RadioGroup
                  defaultValue={selectedLocationId}
                  onValueChange={(data) => {
                    setSelectedLocationId(data);
                  }}
                >
                  {location?.map((item: any, index: number) => (
                    <div
                      className={`grid grid-cols-10 py-4 border-gray-300  ${
                        index !== location.length - 1 && "border-b-2"
                      }`}
                      key={item.id}
                    >
                      <div className="col-span-1">
                        <RadioGroupItem
                          key={item.id}
                          value={item.id}
                          className="w-fit"
                        />
                      </div>
                      <div className="col-span-7 flex flex-col">
                        <div className="flex flex-row">
                          <div className="text-base font-medium	 pr-3 border-r-2 border-gray-400">
                            {item?.name ? item?.name : "Hung Nguyen"}
                          </div>
                          <div className="pl-3">{item?.phoneNumber}</div>
                        </div>
                        <div className="text-sm font-light pr-2 mt-2">
                          {item?.address}, {item?.wardName},{" "}
                          {item?.districtName}, {item?.provinceName}
                        </div>
                        {item?.isDefaultKiot && (
                          <div className="text-sm font-light mt-2 border-2 border-green-600 w-fit text-green-600 px-2 py-1 ">
                            Địa chỉ mặc định giao hỏa tốc
                          </div>
                        )}
                        {item?.isDefaultOnline && (
                          <div className="text-sm font-light mt-2 border-2 border-green-600 w-fit text-green-600 px-2 py-1 ">
                            Địa chỉ mặc định giao online
                          </div>
                        )}
                      </div>

                      <div
                        className="col-span-2 hover:cursor-grab"
                        onClick={() => {
                          setSelectedUpdate(item?.id);
                          setOpenUpdateForm(true);
                          setOpen(false);
                        }}
                      >
                        Cập nhập
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div
                className="hover:cursor-grab mt-4 text-lg text-green-600 pr-4 pl-2 py-2 border-[1px] border-green-600 w-fit"
                onClick={() => {
                  setOpen(false);
                  setOpenAddForm(true);
                }}
              >
                <AddIcon />
                Thêm địa chỉ mới
              </div>
            </ScrollArea>
          </DialogDescription>
          <DialogFooter>
            <Button
              className="mr-4"
              onClick={() => {
                setOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                let locationSelected = location?.filter((item: any) => {
                  return item.id == selectedLocationId;
                })[0];

                setSelectedLocation(locationSelected);

                setOpen(false);
              }}
            >
              Chon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
