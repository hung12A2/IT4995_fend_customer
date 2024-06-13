/* eslint-disable @next/next/no-img-element */
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, use, useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Form, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import CloseIcon from "@mui/icons-material/Close";
import SwapVertSharpIcon from "@mui/icons-material/SwapVertSharp";

const get = (obj: any, path: any, defaultValue?: any) => {
  const travel = (regexp: any) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder: string;
  defaultValue?: string;
  type?: string;
  regex?: any;
  message?: any;
};

export type TextFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder: string;
  regex?: any;
  message?: any;
};

export type PasswordFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder: string;
  regex?: any;
  message?: any;
  defaultValue?: string;
};

export type SelectFieldProps = {
  name: string;
  label: string;
  helpText?: string;
  placeholder?: string;
  required?: boolean;
  options?: any[];
  multiple?: boolean;
  setSelected?: Function;
};

export type CheckedFieldProps = {
  name: string;
  label: string;
  required?: boolean;
};

export const Field = ({
  name,
  label,
  disabled = false,
  placeholder,
  required = false,
  defaultValue,
  type = "text",
  regex,
  message,
}: FieldProps) => {
  const formContext = useFormContext();
  const {
    watch,
    control,
    formState: { errors },
  } = formContext;

  const pattern = {
    required,
    pattern: {
      value: regex,
      message,
    },
  };

  const _rules = { ...pattern };

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={_rules}
      //@ts-ignore
      disabled={disabled}
      render={({ field }) => {
        return (
          // @ts-ignore
          <FormItem hidden={false}>
            <FormLabel className="block mb-4">{label}</FormLabel>
            <FormControl>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                {...field}
              />
            </FormControl>
            <span className="text-xs text-red-500">
              {get(errors, [name, "message"]) != ""
                ? get(errors, [name, "message"])
                : `${name} is required`}
            </span>
          </FormItem>
        );
      }}
    />
  );
};

export const TextField: FC<TextFieldProps> = (props) => {
  return <Field {...props} type="text" defaultValue="" />;
};

export const EmailField: FC<TextFieldProps> = (props) => {
  return (
    <Field
      {...props}
      type="email"
      defaultValue=""
      // regex={/\S+@\S+\.com$/}
      // message="email must have @ and .com"
    />
  );
};

export const PasswordField: FC<PasswordFieldProps> = (props) => {
  return (
    <Field
      {...props}
      type="password"
      defaultValue=""
      // regex={/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/}
      // message="password must contain at least 6 characters, one uppercase letter and one lowercase letter"
    />
  );
};

export const buttonCommonClassNames =
  "w-full justify-normal text-left hover:bg-transparent hover:ring-1 hover:ring-ring font-normal text-slate-500 rounded-md hover:text-black";

export const isEmpty = (obj: any) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export const SelectField: FC<SelectFieldProps> = ({
  setSelected,
  label,
  helpText = "",
  placeholder = "Select...",
  name,
  multiple = false,
  required = false,
  options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ],
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const methods = useFormContext();

  const { control, setValue, getValues } = methods;

  const getLabel = (option: any) => {
    return option.label;
  };

  const onSelectOption = (option: any, selectedOptions: any[] = []) => {
    const selectedOption = {
      value: option.value, // change value to id
      label: getLabel(option),
    };
    let newValue;
    if (multiple) {
      newValue = [...selectedOptions, selectedOption];
    } else {
      newValue = selectedOption;
      setOpen(false);
    }

    setValue(name, newValue, { shouldValidate: true });
  };

  const handleUnselect = useCallback(
    (option?: any) => {
      // does not given option => single select
      setValue(
        name,
        option
          ? getValues(name)?.filter(
              (selected: any) => selected.value != option.value
            )
          : [],
        { shouldValidate: true }
      );
    },
    [setValue, getValues, name]
  );

  const CloseOption: FC<{
    option?: any;
  }> = ({ option }) => (
    <span
      className={cn(
        "h-4 w-4 opacity-50 hover:opacity-100 hover:text-red-500",
        option
          ? "ml-1 pb-px"
          : "absolute top-1/2 right-1 -translate-y-1/2 me-1.5"
      )}
      onClick={() => handleUnselect(option)}
    >
      <CloseIcon viewBox="0 0 28 28" />
    </span>
  );

  return (
    <FormField
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => {
        const selectables = options.filter((option: any) => {
          if (multiple) {
            return !field?.value?.find(
              (o: any) =>
                o?.value == String(option?.id) || o?.value == option.value
            );
          }
          return option;
        });

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <Command className="overflow-visible bg-transparent">
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        buttonCommonClassNames,
                        "relative",
                        field.value?.length
                          ? "p-0.5 h-full"
                          : "text-muted-foreground h-9",
                        multiple && "ps-2"
                      )}
                    >
                      <div className="pe-5">
                        {!isEmpty(field?.value) &&
                          Array.isArray(field?.value) &&
                          field.value?.map((option: any) => {
                            return (
                              <Badge
                                key={option.value}
                                variant="secondary"
                                className={cn(
                                  "h-6.5 m-1 font-normal",
                                  !multiple &&
                                    "text-sm hover:bg-transparent bg-transparent text-slate-500 m-0.5"
                                )}
                              >
                                {option.label}
                                {multiple && <CloseOption option={option} />}
                              </Badge>
                            );
                          })}
                        {!isEmpty(field?.value) &&
                          !Array.isArray(field?.value) &&
                          field?.value?.label}

                        {multiple || isEmpty(field.value) ? (
                          <>
                            {placeholder && placeholder}
                            <SwapVertSharpIcon className="absolute top-1/2 right-1 -translate-y-1/2 me-2 ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <CloseOption />
                        )}
                      </div>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                {selectables && selectables?.length > 0 && (
                  <PopoverContent
                    align="start"
                    className="p-0 overflow-auto max-h-[50vh]"
                  >
                    <CommandInput placeholder="Search..." />

                    <CommandList>
                      <CommandEmpty>NotFound</CommandEmpty>
                      <CommandGroup className="overflow-auto">
                        {selectables.map((option: any) => {
                          return (
                            <CommandItem
                              key={option.value}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                onSelectOption(option, field.value);
                                if (setSelected) {
                                  setSelected(option.value);
                                }
                              }}
                              className={"cursor-pointer"}
                            >
                              {getLabel(option)}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </PopoverContent>
                )}
              </Command>
            </Popover>
            <FormDescription>{helpText}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
      {...props}
    />
  );
};

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export const CheckedField: FC<CheckedFieldProps> = ({ name, label }) => {
  const methods = useFormContext();

  const { control, setValue, getValues } = methods;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label} </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export const ImgFieldMulti: FC<any> = ({
  label,
  helpText = "",
  required,
  name,
  ...props
}) => {
  const formContext = useFormContext();
  const { control, setValue, getValues } = formContext;
  const [imgLinks, setImgLinks] = useState<string[]>([]); // Change to array
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddImg = (e: any) => {
    if (!getValues(name)) {
      setValue(name, e.target.files);
      setImgLinks(
        Array.from(e.target.files).map((file: any) => URL.createObjectURL(file))
      );
      return;
    }
    const newFiles = Array.from(e.target.files);
    setValue(name, [...getValues(name), ...newFiles]); // Concatenate new files to current files
    setImgLinks([
      ...imgLinks,
      ...newFiles.map((file: any) => URL.createObjectURL(file)),
    ]); // Concatenate new URLs to current URLs
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setValue(name, e.dataTransfer.files); // Set all files
    setImgLinks(
      Array.from(e.dataTransfer.files).map((file: any) =>
        URL.createObjectURL(file)
      )
    ); // Map all files to URLs
  };

  return (
    <FormField
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => {
        let safeField = Array.isArray(field?.value)? (field?.value) : [];


        const defaultValues = safeField?.filter((item: any) => item.url);

        return (
          <>
            <FormItem className="flex flex-col justify-between rounded-lg p-2 shadow-sm">
              <FormLabel className=" my-4">{label}</FormLabel>
              <FormControl>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="flex flex-col justify-center w-full py-5 border-[1px] border-black border-dashed"
                >
                  <input
                    className="w-full"
                    placeholder="Chọn ảnh"
                    type="file"
                    onChange={handleAddImg}
                    title="Chọn ảnh"
                    ref={inputRef}
                    hidden
                    multiple={true}
                  />
                  <h1 className="mx-auto">Drag and drop File to upload</h1>
                  <h1 className="mx-auto mt-2">Or</h1>
                  <button
                    className="p-4 py-2 bg-muted w-fit mx-auto rounded-md mt-4"
                    onClick={() => inputRef.current?.click()}
                  >
                    Select Files
                  </button>
                  {imgLinks ? (
                    <div className="mt-6">
                      <div className="grid grid-cols-4 gap-x-4 px-3">
                        {
                          // @ts-ignore
                          defaultValues?.map((imgLink: any, index) => (
                            <div key={index} className="relative">
                              <img
                                key={index}
                                src={imgLink.url || imgLink}
                                className="mx-auto aspect-[9/16]"
                                alt=""
                              ></img>
                              <CloseIcon
                                className="absolute -top-4 -right-4 hover:cursor-grab border-[1px] border-gray-300 rounded-full bg-white hover:bg-gray-200"
                                onClick={() => {
                                  // Update form state
                                  const newFiles = Array.from(getValues(name));
                                  newFiles.splice(index, 1);
                                  setValue(name, newFiles);
                                }}
                              />
                            </div>
                          ))
                        }

                        {
                          // @ts-ignore
                          imgLinks?.map((imgLink, index) => (
                            <div key={index} className="relative">
                              <img
                                key={index}
                                src={imgLink}
                                className="mx-auto aspect-[9/16]"
                                alt=""
                              ></img>
                              <CloseIcon
                                className="absolute -top-4 -right-4 hover:cursor-grab border-[1px] border-gray-300 rounded-full bg-white hover:bg-gray-200"
                                onClick={() => {
                                  const newImgLinks = [...imgLinks];
                                  newImgLinks.splice(
                                    index + defaultValues.length,
                                    1
                                  );
                                  setImgLinks(newImgLinks);

                                  // Update form state
                                  const newFiles = Array.from(getValues(name));
                                  newFiles.splice(
                                    index + defaultValues.length,
                                    1
                                  );
                                  setValue(name, newFiles);
                                }}
                              />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </>
        );
      }}
      {...props}
    />
  );
};

export function DatePickerForm({
  label,
  helpText = "",
  required,
  name,
  ...props
}: any) {
  const formContext = useFormContext();
  const { control, setValue, getValues } = formContext;

  return (
    <FormField
      control={control}
      name={name}
      rules={{ required }}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
               classNames={{
                caption: 'relative w-full h-fit',
                caption_label: 'hidden',
                vhidden: 'hidden',
                caption_dropdowns:
                  'flex justify-center z-10 w-fit left-[15%] relative top-5',
                dropdown_month: 'mr-3',
                nav: 'space-x-1 flex items-center justify-between w-full ',
              }}

                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown-buttons"
                fromYear={2010}
                toYear={2024}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            Your date of birth is used to calculate your age.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
