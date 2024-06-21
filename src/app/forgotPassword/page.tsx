"use client";

import { useRouter } from "next/navigation";
import React from "react";
import axios from "../../module/AxiosCustom/custome_Axios";
import { EmailField } from "../../module/base/fieldBase";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

const Forgetpass = () => {
  const router = useRouter();
  const { toast } = useToast();
  const formContext = useForm({});

  const { handleSubmit } = formContext;

  const onSubmit = async (data: any) => {
    const { email } = data;
    const dataFetch = await axios
      .post("/forgotPassword/customer", { email })
      .then((res) => res.data)
      .catch((e) => console.log(e));

    router.push("/sendSuccess");
  };

  return (
    <>
      <div className="bg-grey-lighter min-h-screen flex flex-col bg-[url('https://asianfoodnetwork.com/content/dam/afn/global/en/homepage/new-content-carousel/AFN_Food_Made_Good_HK_Awards_good_to_go_award_mobile.jpg.transform/desktop-img/img.jpg')]">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center font-semibold">
              Reset Password
            </h1>
            <FormProvider {...formContext}>
              <div className="mb-4">
                <EmailField
                  name="email"
                  label="email"
                  placeholder="email"
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
          </div>

          <div className="text-white mt-6">
            Remember your password?
            <a
              className="no-underline border-b border-blue text-blue-500 font-semibold hover:cursor-grab"
              onClick={() => {
                router.push("/Login");
              }}
            >
              Log in
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgetpass;