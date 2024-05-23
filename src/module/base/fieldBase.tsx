import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC } from "react";

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

  console.log(errors);

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
                placeholder= {placeholder}
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
