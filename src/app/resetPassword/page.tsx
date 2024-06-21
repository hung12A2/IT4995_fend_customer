"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailField, PasswordField } from "../../module/base/fieldBase";
import { useForm, FormProvider } from "react-hook-form";
import axios from "../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";

const EnterNewPass = () => {
  return (
    <Suspense>
      <EnterNewPass2 />
    </Suspense>
  );
};

const EnterNewPass2 = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const formContext = useForm({});
  const { handleSubmit } = formContext;

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    const { newPassword } = data;
    const dataFetch: any = await axios
      .post("/resetPassword/customer", { newPassword, token })
      .then((res) => res)
      .catch((e) => console.log(e));

    if (dataFetch.code === 400) {
      toast({
        title: " Invalid or expired token",
        variant: "destructive",
      });
    }

    if (dataFetch.code === 200) {
      toast({
        title: "Password reset successfully",
      });
    }
  };

  return (
    <>
      <div className="bg-grey-lighter min-h-screen flex flex-col bg-[url('https://asianfoodnetwork.com/content/dam/afn/global/en/homepage/new-content-carousel/AFN_Food_Made_Good_HK_Awards_good_to_go_award_mobile.jpg.transform/desktop-img/img.jpg')]">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center font-semibold">
              Enter New Password
            </h1>

            <FormProvider {...formContext}>
              <div className="mb-4">
                <PasswordField
                  name="newPassword"
                  label="newPassword"
                  placeholder="newPassword"
                  required={true}
                />
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-3"
              >
                Submit
              </button>
            </FormProvider>

            <div className="text-center text-sm text-grey-dark mt-4">
              <a
                className="no-underline border-b border-grey-dark text-md text-grey-dark text-green-700 font-semibold"
                onClick={() => {
                    router.push ('/Login')
                }}
              >
                Back To Home
              </a>
            </div>
          </div>

          <div className="text-white mt-6 font-semibold">
            Dont have an account?
            <a
              className="no-underline border-b border-blue text-blue-500 font-semibold"
              href="#"
            >
              Create Account
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterNewPass;
