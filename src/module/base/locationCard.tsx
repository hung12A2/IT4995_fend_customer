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

export default function LocationCard({
  location,
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

  const formContext = useForm({});
  const { handleSubmit } = formContext;
  let formUpdateContext = useForm({});
  const { handleSubmit: handleSubmitUpdate, setValue: setValueUpdate } =
    formUpdateContext;
  const locationKiotDefault = location?.filter(
    (item: any) => item?.isDefaultKiot == true
  )[0];

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="border-[1px] px-2 py-1 rounded-sm border-green-600 hover:cursor-grab">
            {locationKiotDefault?.address}, {locationKiotDefault?.wardName},{" "}
            {locationKiotDefault?.districtName}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dia chi cua toi</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <ScrollArea className="h-100 rounded-md ">
              <div className="mt-4">
                <RadioGroup>
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
                      </div>
                      <div
                        className="col-span-2 hover:cursor-grab"
                        onClick={() => {
                          setSelectedUpdate(item?.id);
                          setOpenUpdateForm(true);
                          setOpen(false);
                        }}
                      >
                        Cap nhap
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
                Them dia chi moi
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
              Huy
            </Button>
            <Button
              onClick={() => {
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
