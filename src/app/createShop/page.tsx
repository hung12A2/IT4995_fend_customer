/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useAuthContext } from "@/provider/auth.provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormProvider, set, useForm } from "react-hook-form";
import {
  EmailField,
  ImgFieldMulti,
  SelectField,
  TextField,
} from "@/module/base/fieldBase";
import { useEffect, useState } from "react";
import axios from "../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useRouter } from "next/navigation";

export default function Page() {
  const [listProvince, setListProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [typeForm, setTypeForm] = useState<string>("create");
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [selectedProvince2, setSelectedProvince2] = useState<string>("");
  const [selectedDistrict2, setSelectedDistrict2] = useState<string>("");
  const [listDistrict2, setListDistrict2] = useState([]);
  const [listWard2, setListWard2] = useState([]);
  const authContext = useAuthContext();
  const { user } = authContext;
  let defaultForm = {};
  const formContext = useForm(defaultForm);
  const { handleSubmit, setValue } = formContext;
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      let res: any = await axios
        .get(`/request-create-shops/getByUser`)
        .then((res) => res)
        .catch((e) => console.log(e));

      if (res.id) {
        setTypeForm("update");
        setValue("name", res.name);
        setValue("pickUpAddress", res.pickUpAddress);
        setValue("returnAddress", res.returnAddress);
        setValue("pickUpProvince", {
          value: `${res.pickUpProvinceName}-${res.pickUpProvinceId}`,
          label: res.pickUpProvinceName,
        });
        setValue("returnProvince", {
          value: `${res.returnProvinceName}-${res.returnProvinceId}`,
          label: res.returnProvinceName,
        });
        setValue("pickUpDistrict", {
          value: `${res.pickUpDistrictName}-${res.pickUpDistrictId}`,
          label: res.pickUpDistrictName,
        });
        setValue("returnDistrict", {
          value: `${res.returnDistrictName}-${res.returnDistrictId}`,
          label: res.returnDistrictName,
        });
        setValue("pickUpWard", {
          value: `${res.pickUpWardName}-${res.pickUpWardCode}`,
          label: res.pickUpWardName,
        });

        setValue("returnWard", {
          value: `${res.returnWardName}-${res.returnWardCode}`,
          label: res.returnWardName,
        });
        setValue("email", res.email);
        setValue("phoneNumber", res.phoneNumber);
        setValue("IDcardImg", res.IDcardImg);
        setValue("BLicenseImg", res.BLicenseImg);
      }
    }

    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    if (typeForm == "create") {
      let {
        name,
        pickUpAddress,
        returnAddress,
        pickUpProvince,
        returnProvince,
        pickUpDistrict,
        returnDistrict,
        pickUpWard,
        returnWard,
        email,
        phoneNumber,
        IDcardImg,
        BLicenseImg,
      } = data;
      pickUpProvince = pickUpProvince.value;
      returnProvince = returnProvince.value;
      pickUpDistrict = pickUpDistrict.value;
      returnDistrict = returnDistrict.value;
      pickUpWard = pickUpWard.value;
      returnWard = returnWard.value;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("pickUpAddress", pickUpAddress);
      formData.append("returnAddress", returnAddress);
      formData.append("pickUpProvince", pickUpProvince);
      formData.append("returnProvince", returnProvince);
      formData.append("pickUpDistrict", pickUpDistrict);
      formData.append("returnDistrict", returnDistrict);
      formData.append("pickUpWard", pickUpWard);
      formData.append("returnWard", returnWard);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);

      if (IDcardImg) {
        Array.from(IDcardImg).forEach((item: any) => {
          formData.append("IDcardImg", item);
        });
      }
      if (BLicenseImg) {
        Array.from(BLicenseImg).forEach((item: any) => {
          formData.append("BLicenseImg", item);
        });
      }

      let res: any = await axios
        .post("/request-create-shops/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      if (res) {
        toast({
          title: "Gui don tao shop thanh cong",
        });
      } else {
        toast({
          title: "Gui don tao shop that bai",
        });
      }
    } else {
      let {
        name,
        pickUpAddress,
        returnAddress,
        pickUpProvince,
        returnProvince,
        pickUpDistrict,
        returnDistrict,
        pickUpWard,
        returnWard,
        email,
        phoneNumber,
        IDcardImg,
        BLicenseImg,
      } = data;
      pickUpProvince = pickUpProvince.value;
      returnProvince = returnProvince.value;
      pickUpDistrict = pickUpDistrict.value;
      returnDistrict = returnDistrict.value;
      pickUpWard = pickUpWard.value;
      returnWard = returnWard.value;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("pickUpAddress", pickUpAddress);
      formData.append("returnAddress", returnAddress);
      formData.append("pickUpProvince", pickUpProvince);
      formData.append("returnProvince", returnProvince);
      formData.append("pickUpDistrict", pickUpDistrict);
      formData.append("returnDistrict", returnDistrict);
      formData.append("pickUpWard", pickUpWard);
      formData.append("returnWard", returnWard);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);

      if (IDcardImg) {
        Array.from(IDcardImg).forEach((item: any) => {
          if (item.url) {
            formData.append("oldIDcardImg", JSON.stringify(item));
          } else {
            formData.append("IDcardImg", item);
          }
        });
      }
      if (BLicenseImg) {
        Array.from(BLicenseImg).forEach((item: any) => {
          if (item.url) {
            formData.append("oldBLicenseImg", JSON.stringify(item));
          } else {
            formData.append("BLicenseImg", item);
          }
        });
      }

      let res: any = await axios
        .post("/request-create-shop/update", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      if (res) {
        toast({
          title: "Gui don tao shop thanh cong",
        });
      } else {
        toast({
          title: "Gui don tao shop that bai",
        });
      }
    }
  };

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
    async function fetchDistrict() {
      let res: any = await axios
        .post(`/location/district/${selectedProvince2?.split("-")[1]}`)
        .then((res) => res.data)
        .catch((e) => console.log(e));

      res = res.map((item: any) => {
        return {
          value: `${item.districtName}-${item.districtId}`,
          label: item.districtName,
        };
      });

      setListDistrict2(res);
    }

    fetchDistrict();
  }, [selectedProvince2]);

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
    async function fetchWard() {
      let res: any = await axios
        .post(`/location/ward/${selectedDistrict2?.split("-")[1]}`)
        .then((res) => res.data)
        .catch((e) => console.log(e));

      res = res?.map((item: any) => {
        return {
          value: `${item.wardName}-${item.wardCode}`,
          label: item.wardName,
        };
      });

      setListWard2(res);
    }

    fetchWard();
  }, [selectedDistrict2]);

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full px-4 py-4 flex flex-row justify-between bg-white border-[1px] shadow-sm">
        <div className="flex flex-row gap-x-2 justify-center items-center">
          <img
            className="w-8"
            src="https://static.wixstatic.com/media/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png/v1/fill/w_320,h_320,q_90/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png"
            alt=""
          ></img>
          <div className="text-green-500 text-xl font-medium">Luna Shop</div>
        </div>
        <div>
          <div className="flex flex-row gap-x-2 justify-center items-center mr-4 hover:cursor-grab">
            <Avatar>
              <AvatarImage src={user?.avatar?.url} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>{user?.fullName || user?.id}</div>
          </div>
        </div>
      </div>
      <FormProvider {...formContext}>
        <div className="w-2/3 mt-6 bg-white">
          <div
            className="flex items-center hover:cursor-grab"
            onClick={() => {
              router.back();
            }}
          >
            <NavigateBeforeIcon /> Tro lai
          </div>
          <div className="px-32 py-6 border-b-[1px] border-gray-300">
            Thong tin shop
          </div>
          {user?.idOfShop && (
            <div className="h-[80vh] flex flex-col justify-center w-full items-center text-center	">
              <div className="w-fit px-64">
                Ban da co shop, dang nhap vao trang{" "}
                <a href="https://it4995-stores2-node20.azurewebsites.net/" className="font-medium text-md text-green-600">
                  https://it4995-stores2-node20.azurewebsites.net/
                </a>
                de quan ly shop cua minh nhes
              </div>
            </div>
          )}

          {!user?.idOfShop && (
            <>
              <div className="px-32 py-16 border-b-[1px] border-gray-300">
                <div className="mb-4">
                  <TextField
                    name="name"
                    label="Name"
                    placeholder="name"
                    required={true}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    name="pickUpAddress"
                    label="Pick up address"
                    placeholder="Pick up address"
                    required={true}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    name="returnAddress"
                    label="Return address"
                    placeholder="Return address"
                    required={true}
                  />
                </div>
                <div>
                  <SelectField
                    setSelected={(value: any) => {
                      setSelectedProvince(value);
                    }}
                    name="pickUpProvince"
                    label="pickUpProvince"
                    options={listProvince}
                  />
                </div>
                <div>
                  <SelectField
                    setSelected={(value: any) => {
                      setSelectedProvince2(value);
                    }}
                    name="returnProvince"
                    label="returnProvince"
                    options={listProvince}
                  />
                </div>
                <div>
                  <SelectField
                    setSelected={(value: any) => {
                      setSelectedDistrict(value);
                    }}
                    name="pickUpDistrict"
                    label="pickUpDistrict"
                    options={listDistrict}
                  />
                </div>
                <div>
                  <SelectField
                    setSelected={(value: any) => {
                      setSelectedDistrict2(value);
                    }}
                    name="returnDistrict"
                    label="returnDistrict"
                    options={listDistrict2}
                  />
                </div>
                <div>
                  <SelectField
                    name="pickUpWard"
                    label="pickUpWard"
                    options={listWard}
                  />
                </div>
                <div>
                  <SelectField
                    name="returnWard"
                    label="returnWard"
                    options={listWard2}
                  />
                </div>
                <div className="mb-4">
                  <EmailField
                    name="email"
                    label="Email"
                    placeholder="email"
                    required={true}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Phone Number"
                    required={true}
                  />
                </div>
                <div className="mb-4">
                  <ImgFieldMulti
                    name="IDcardImg"
                    label="IDcardImg"
                    required={true}
                  />
                </div>
                <div className="mb-4">
                  <ImgFieldMulti
                    name="BLicenseImg"
                    label="BLicenseImg"
                    required={true}
                  />
                </div>
              </div>
              <div className="py-4 px-32 flex flex-row justify-end gap-x-4">
                <div className="px-4 py-1 border-[1px] border-gray-300 hover:cursor-grab shadow-sm hover:bg-gray-100">
                  Luu
                </div>
                <div
                  className="px-4 py-1 text-white bg-green-600 hover:cursor-grab hover:bg-green-700"
                  onClick={handleSubmit(onSubmit)}
                >
                  Tiep theo
                </div>
              </div>
            </>
          )}
        </div>
      </FormProvider>
    </div>
  );
}
