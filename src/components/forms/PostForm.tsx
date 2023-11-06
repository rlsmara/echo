"use client"

import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

import {
  Button,
  Input,
  Textarea,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
} from "@/components/ui";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: Models.Document;
  action: 'Create' | 'Update';
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const naviagte = useNavigate();

  // Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "", 
      tags: post ? post.tags.join(', ') : ''
    },
  })

  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();
 
  // Define a submit handler - Connect to appwrite and create/update post
  async function onSubmit(value: z.infer<typeof PostValidation>) {
    // ACTION = UPDATE
    if(post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl
      })

      if(!updatedPost) {
        toast({ title: `${action} post failed. Please try again.` })
      }

      // Send to post details page
      return naviagte(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    })

    if(!newPost) {
      toast({ title: `${action} post failed. Please try again.` })
    }

    // Send to homepage
    naviagte("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        {/* FORM INPUT FOR CAPTION */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar"{...field} />
              </FormControl>
              <FormMessage className="shad-from_message"/>
            </FormItem>
          )}
        />

        {/* FORM INPUT FOR PHOTOS */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-from_message"/>
            </FormItem>
          )}
        />

        {/* FORM INPUT FOR LOCATION */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field}/>
              </FormControl>
              <FormMessage className="shad-from_message"/>
            </FormItem>
          )}
        />

        {/* FORM INPUT FOR TAGS */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" placeholder="Art, Expression, Learn" {...field}/>
              </FormControl>
              <FormMessage className="shad-from_message"/>
            </FormItem>
          )}
        />

        {/* CREATE/UPDATE POST BUTTONS */}
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4" onClick={() => naviagte(-1)}>Cancel</Button>
          <Button 
            type="submit" 
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || isLoadingUpdate && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm;