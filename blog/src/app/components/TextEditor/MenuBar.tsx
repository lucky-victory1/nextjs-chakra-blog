'use client'
import {
    Box,
    HStack,
    IconButton,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Input,
    Text,
    Portal,
    useColorModeValue,
    Button,
  } from "@chakra-ui/react";
  import {Menu,MenuButton,MenuItem,MenuList} from '@/src/app/components/ui/Menu'
  import { Editor, useCurrentEditor } from "@tiptap/react";
  import { useFormik } from "formik";
  import isEmpty from "just-is-empty";
  import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";

  import {CldUploadButton, CldUploadWidget, type CloudinaryUploadWidgetInfo,type CloudinaryUploadWidgetResults, getCldImageUrl} from 'next-cloudinary'
import { LuAlignCenter, LuAlignJustify, LuAlignLeft, LuAlignRight, LuBold, LuCornerDownLeft, LuHeading6, LuHighlighter, LuImagePlus, LuItalic, LuLink, LuList, LuListOrdered, LuPilcrow, LuQuote, LuRedo2, LuStrikethrough, LuUndo2,LuHeading1,LuHeading2,LuHeading5,LuHeading3,LuHeading4, LuArrowDown, LuChevronDown } from "react-icons/lu";
import { IconType } from "react-icons";
  
  export const MenuBar = () => {
    const { editor } = useCurrentEditor();
    const initialFocusRef = useRef<any>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const btnStyles = {
      size: "sm",
      fontSize: "medium",
      // colorScheme: "gs-yellow",
    };
    const formik = useFormik({
      initialValues: {
        content: "",
      },
      onSubmit: (values, actions) => {
        const content = values.content;
        const previousUrl = editor?.getAttributes("link").href;
        actions.setFieldValue("content", previousUrl);
        const url = content;
  
        if (url === null) {
          return;
        }
  
        // empty
        if (isEmpty(url)) {
          editor?.chain().focus().extendMarkRange("link").unsetMark('link').run();
  
          return;
        }
  
        // update link
        editor?.chain().focus().extendMarkRange("link").setMark('link',{ href: url }).run();
        onClose();
      },
    });

    const borderColorValue = useColorModeValue("gray.200", "gray.800");
    const bgColorValue = useColorModeValue("white", "gray.800");
    const iconColorValue = useColorModeValue('gray.500', 'gray.200');
    const activeTextColorValue = useColorModeValue('white', 'white');

    if (!editor) {
      return <></>;
    }
 const editorButtonActions=[{
  icon:LuPilcrow,
  action:()=>editor.chain().focus().setParagraph().run(),
  active:editor.isActive("paragraph"),
  label:"Paragraph",
 },{
    icon:LuHeading1,
    action:()=>editor.chain().focus().setHeading({ level: 1 }).run(),
    active:editor.isActive("heading", { level: 1 }),
    label:"Heading 1",
  },{
    icon:LuHeading2,
    action:()=>editor.chain().focus().setHeading({ level: 2 }).run(),
    active:editor.isActive("heading", { level: 2 }),
    label:"Heading 2",
  },{
    icon:LuHeading3,
    action:()=>editor.chain().focus().setHeading({ level: 3 }).run(),
    active:editor.isActive("heading", { level: 3 }),
    label:"Heading 3",
  },{
    icon:LuHeading4,
    action:()=>editor.chain().focus().setHeading({ level: 4 }).run(),
    active:editor.isActive("heading", { level: 4 }),
    label:"Heading 4",
  },{
    icon:LuHeading5,
    action:()=>editor.chain().focus().setHeading({ level: 5 }).run(),
    active:editor.isActive("heading", { level: 5 }),
    label:"Heading 5",
  },{
    icon:LuHeading6,
    action:()=>editor.chain().focus().setHeading({ level: 6 }).run(),
    active:editor.isActive("heading", { level: 6 }),
    label:"Heading 6",
  },{
    icon:LuBold,
    action:()=>editor.chain().focus().toggleBold().run(),
    active:editor.isActive("bold"),
    label:"Bold",
  },{
    icon:LuItalic,
    action:()=>editor.chain().focus().toggleItalic().run(),
    active:editor.isActive("italic"),
    label:"Italic",
  },{
    icon:LuStrikethrough,
    action:()=>editor.chain().focus().toggleStrike().run(),
    active:editor.isActive("strike"),
    label:"Strikethrough",
  },{
    icon:LuHighlighter,
    action:()=>editor.chain().focus().toggleHighlight().run(),
    active:editor.isActive("highlight"),
    label:"Highlight",
  },{
    icon:LuList,
    action:()=>editor.chain().focus().toggleBulletList().run(),
    active:editor.isActive("bulletList"),
    label:"Bullet List",
  },
  {
    icon:LuListOrdered,
    action:()=>editor.chain().focus().toggleOrderedList().run(),
    active:editor.isActive("orderedList"),
    label:"Ordered List",
  }
]
const extractNonHeadingOrParagraph = () => {
  return editorButtonActions.filter(item => 
    item.label && !item.label.startsWith("Heading") && item.label !== "Paragraph"  )
}

const nonHeadingOrParagraphActions = extractNonHeadingOrParagraph()

const paragraphAndHeadings = editorButtonActions.filter(item => 
  item.label === "Paragraph" || (item.label && item.label.startsWith("Heading")))
  const getActiveActionItem=()=>{
    const activeActionItem = paragraphAndHeadings.find(item => item.active)
    if(activeActionItem){
      return activeActionItem as {label:string,icon:IconType,action:()=>void,active:boolean}
    }
    return paragraphAndHeadings[0] as {label:string,icon:IconType,action:()=>void,active:boolean}
  }

  
    return (
      <HStack
        wrap={"wrap"}
        gap={2}
        border={"1px"}
        py={2}
        px={1}
        rounded={"md"}
        borderColor={borderColorValue}
      
        top={0}
        bg={bgColorValue}
        zIndex={2}
      >
        <Menu>
          <MenuButton as={Button} {...btnStyles} display={'flex'}>
            <HStack spacing={2}>
              {getActiveActionItem() && React.createElement(getActiveActionItem().icon, { size: 20, color: iconColorValue })}
              <LuChevronDown size={18} />
            </HStack>
          </MenuButton>
          <MenuList rounded={'xl'} px={2} gap={1} display={'flex'} flexDir={'column'}>
            {paragraphAndHeadings?.map((item, index) => (
              <MenuItem onClick={() => item?.action?.()} color={item?.active ? activeTextColorValue : undefined} bg={item?.active ? 'blue.500' : undefined} key={index} icon={item.icon && React.createElement(item.icon, { size: 20 })} rounded={'xl'}>
                <Text as={'span'} fontSize={'16px'} fontWeight={500}>{item.label}</Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive("bold") ? "solid" : "ghost"}
        >
          <LuBold size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "solid" : "ghost"}
        >
          <LuItalic size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          variant={editor.isActive("strike") ? "solid" : "ghost"}
        >
          <LuStrikethrough size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          variant={editor.isActive("highlight") ? "solid" : "ghost"}
        >
          <LuHighlighter size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          variant={editor.isActive({ textAlign: "left" }) ? "solid" : "ghost"}
        >
          <LuAlignLeft size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          variant={editor.isActive({ textAlign: "center" }) ? "solid" : "ghost"}
        >
          <LuAlignCenter size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          variant={editor.isActive({ textAlign: "right" }) ? "solid" : "ghost"}
        >
          <LuAlignRight size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          variant={editor.isActive({ textAlign: "justify" }) ? "solid" : "ghost"}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <LuAlignJustify size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          variant={editor.isActive("bulletList") ? "solid" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <LuList size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          variant={editor.isActive("orderedList") ? "solid" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LuListOrdered size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          variant={editor.isActive("blockquote") ? "solid" : "ghost"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <LuQuote size={20} />
        </IconButton>
        <CldUploadWidget uploadPreset="post_images" onSuccess={(image: CloudinaryUploadWidgetResults) => {
          editor.chain().focus().setImage({ src: getCldImageUrl({ src: (image.info as CloudinaryUploadWidgetInfo).public_id }) }).run();
        }}>
          {({ open }) => {
            return (
              <IconButton
                aria-label=""
                {...btnStyles}
                variant={editor.isActive("img") ? "solid" : "ghost"}
                onClick={() => open()}
              >
                <LuImagePlus size={20} />
              </IconButton>
            );
          }}
        </CldUploadWidget>

        <Popover onClose={onClose} onOpen={onOpen} isOpen={isOpen} initialFocusRef={initialFocusRef}>
          <PopoverTrigger>
            <IconButton aria-label="" {...btnStyles} variant={editor.isActive("link") ? "solid" : "ghost"}>
              <LuLink size={20} />
            </IconButton>
          </PopoverTrigger>
          <Portal>
            <PopoverContent zIndex={100000} py={4}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight="bold" border="0">
                Enter URL:
              </PopoverHeader>
              <PopoverBody>
                <HStack
                  as={"form"}
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                  }}
                >
                  <Input
                    name="content"
                    rounded={"md"}
                    autoComplete="off"
                    value={formik.values.content}
                    ref={initialFocusRef}
                    onChange={formik.handleChange}
                    placeholder="https://example.com"
                    size={"sm"}
                  />
                  <IconButton aria-label="" variant={"ghost"} type="submit">
                    <LuCornerDownLeft />
                  </IconButton>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>

        <IconButton
          aria-label=""
          {...btnStyles}
          isDisabled={!editor.can().undo()}
          variant={"ghost"}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <LuUndo2 size={20} />
        </IconButton>
        <IconButton
          aria-label=""
          {...btnStyles}
          isDisabled={!editor.can().redo()}
          variant={"ghost"}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <LuRedo2 size={20} />
        </IconButton>
      </HStack>
    );
  };