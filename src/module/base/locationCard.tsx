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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SelectField, TextField } from "./fieldBase";

export default function LocationCard({ location }: { location: any }) {
  const [open, setOpen] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  const formContext = useForm({});
  const { handleSubmit } = formContext;
  const locationKiotDefault = location?.filter(
    (item: any) => item?.isDefaultKiot == true
  )[0];

  const locations = [
    {
      id: "1",
      name: "Hung Nguyen",
      address: "lhu pho thi tran Thanh Thuyr",
      wardName: "Thanh Thuy",
      districtName: "huyen Thanh Thuy",
      provinceName: "Phu Tho",
      phoneNumber: "0987654321",
    },
    {
      id: "2",
      name: "Hung Nguyen",
      address: "lhu pho thi tran Thanh Thuyr",
      wardName: "Thanh Thuy",
      districtName: "huyen Thanh Thuy",
      provinceName: "Phu Tho",
      phoneNumber: "0987654321",
    },
    {
      id: "3",
      name: "Hung Nguyen",
      address: "lhu pho thi tran Thanh Thuyr",
      wardName: "Thanh Thuy",
      districtName: "huyen Thanh Thuy",
      provinceName: "Phu Tho",
      phoneNumber: "0987654321",
    },
    {
      id: "4",
      name: "Hung Nguyen",
      address: "lhu pho thi tran Thanh Thuyr",
      wardName: "Thanh Thuy",
      districtName: "huyen Thanh Thuy",
      provinceName: "Phu Tho",
      phoneNumber: "0987654321",
    },
  ];

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
                name="email"
                label="email"
                placeholder="email"
                required={true}
              />
            </div>
            <div className="mb-4 ">
              <TextField
                required={true}
                name="password"
                label="password"
                placeholder="password"
              />
            </div>
            <div>
              <SelectField name="province" label="province" />
            </div>
            <Button
              onClick={handleSubmit((data) => {
                console.log(data);
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
                  {locations.map((item, index) => (
                    <div
                      className={`grid grid-cols-10 py-4 border-gray-300  ${
                        index !== locations.length - 1 && "border-b-2"
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
                            {item?.name}
                          </div>
                          <div className="pl-3">{item?.phoneNumber}</div>
                        </div>
                        <div className="text-sm font-light pr-2 mt-2">
                          {item?.address}, {item?.wardName},{" "}
                          {item?.districtName}, {item?.provinceName}
                        </div>
                      </div>
                      <div className="col-span-2"> Cap nhap </div>
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
