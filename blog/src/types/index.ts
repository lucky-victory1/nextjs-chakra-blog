import { InferInsertModel } from 'drizzle-orm'
import {posts} from '@/src/db/schemas/posts.sql'
import { Editor } from '@tiptap/react'
import { IconType } from 'react-icons'
export interface Post {
    id: number
    title: string
    content: string
    author: {
      name: string
      avatar: string
    }
    date: string
    image:string
  }
export type PostToPost =PostInsert & {
    categories:string[],
    tags:string[],
   
}
export type PostInsert=InferInsertModel<typeof posts>
export interface EditorActionItem{
  label:string;
  action:({editor,open}:{editor?:Editor,open?:()=>void})=>void,
  icon:IconType;
  active:(editor:Editor)=>boolean;

}