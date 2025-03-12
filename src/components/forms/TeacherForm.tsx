"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchema";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { startTransition } from "react";

const TeacherForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const [img, setImg] = useState<any>();
  const [showToast, setShowToast] = useState(false);
  const actionFunction = type === "create" ? createTeacher : updateTeacher;
 console.log("Action function selected:", actionFunction);



  // const [state, formAction] = useActionState(
  //   type === "create" ? createTeacher : updateTeacher,
  //   {
  //     success: false,
  //     error: false,
  //   }
  // );

  const [state, formAction] = useActionState(
   
    (currentState: { success: boolean; error: boolean }, data: TeacherSchema) =>
      type === "create" ? createTeacher(currentState, data) : updateTeacher(currentState, { ...data, id: data.id }),
    {
      success: false,
      error: false,
    }
  );

  // const onSubmit = handleSubmit(async (data) => {
  //   console.log("formAction function:", formAction);
  //   const teacherData = { ...data, img: img?.secure_url };

  //   const response = await createTeacher({
  //     success: false,
  //     error: false,
  //   },teacherData);
  //   console.log("Response from createTeacher:", response);
  
  //   // startTransition(() => {
  //   //   console.log("Inside start transition. Data being sent:", { ...data, img: img?.secure_url });
  //   //   formAction({ ...data, img: img?.secure_url });
  //   // });
    
  //   console.log("After startTransition");
  // });
  
  const onSubmit = handleSubmit(async (data) => {
    const teacherData = { ...data, img: img?.secure_url };
    console.log("data here",data)

    if (type === "create") {
      const response = await createTeacher({
        success: false,
        error: false,
      }, teacherData);
      console.log("Response from createTeacher:", response);
    } else {
      // Make sure to include the id for updates
      const response = await updateTeacher({
        success: false,
        error: false,
      }, { ...teacherData, id: data.id });
      console.log("Response from updateTeacher:", response);
    }
  });


  const router = useRouter();

  

  useEffect(() => {
    if (state?.success) {
      console.log("Success! Closing form & showing toast.");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setOpen(false);
        router.refresh();
      }, 2000);
    }
  }, [state?.success, router, setOpen]);

  const { subjects } = relatedData

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new teacher" : "Update the teacher"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          defaultValue={data?.birthday ? new Date(data.birthday).toISOString().split("T")[0] : ""}
          register={register}
          error={errors.birthday}
          type="date"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />


        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

         <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjects")}
            defaultValue={data?.subjects}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>


        <CldUploadWidget
            uploadPreset="school"
            onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {

            return (
              <div
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Upload a photo</span>
              </div>
            );
          }}


        </CldUploadWidget>

      </div>

      {state && state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>

      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
          Teacher has been {type === "create" ? "created" : "updated"}!
        </div>
      )}
    </form>
  );
};

export default TeacherForm;