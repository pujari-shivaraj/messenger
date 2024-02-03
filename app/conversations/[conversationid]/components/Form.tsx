"use client"

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { useParams } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";

const Form = () =>{

  const {conversationId} = useConversation();

  const params = useParams();

  
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: {    
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    let  conversationid = params.conversationid
    setValue('message', '', { shouldValidate: true });
     
    console.log("seen4")

    axios.post('/api/messages', {
      ...data,
      conversationid
    })
  }
  
  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      conversationId: conversationId
    })
  }
   
  
  return(
   
    <div 
    className="
      py-4 
      px-4 
      bg-white 
      border-t 
      flex 
      items-center 
      gap-2 
      lg:gap-4 
      w-full
    "
  >
      <CldUploadButton
        options={{maxFiles:1}}
        onUpload={handleUpload}  
        uploadPreset="judosc2n"      
      >
      <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="flex items-center gap-2 lg:gap-4 w-full"
    >
      <MessageInput 
        id="message" 
        register={register} 
        errors={errors} 
        required 
        placeholder="Write a message"
      />
      <button 
        type="submit" 
        className="
          rounded-full 
          p-2 
          bg-sky-500 
          cursor-pointer 
          hover:bg-sky-600 
          transition
        "
      >
        <HiPaperAirplane
          size={18}
          className="text-white"
        />
      </button>
    </form>
  </div>
);
}

  

export default Form;