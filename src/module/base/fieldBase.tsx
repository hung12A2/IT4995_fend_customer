import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
                onChange={field.onChange}
                placeholder={placeholder}
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
      console.log(option);
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
                              onSelect={() =>
                                onSelectOption(option, field.value)
                              }
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
