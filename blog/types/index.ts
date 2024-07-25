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