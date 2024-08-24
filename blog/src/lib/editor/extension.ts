import {  Extension, Editor  } from '@tiptap/react'

import Suggestion from '@tiptap/suggestion'

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }:{ editor: Editor; range: Range; props: any }) => {
          props.command({ editor, range });
        },
      },
    };
    
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        startOfLine: true,
        ...this.options.suggestion,
      }),
    ];
  },
});