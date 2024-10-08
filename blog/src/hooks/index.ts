'use client';
import {  usePathname, useSearchParams } from 'next/navigation';
import { FormikErrors, useFormik } from 'formik';
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Post, PostSelect } from '@/src/types';
import TurndownService from "turndown";
import { useMutation } from '@tanstack/react-query';
import debounce from 'lodash/debounce';

export type SaveableValue = string | Record<string, any>;

export interface UseAutoSaveOptions<T extends SaveableValue> {
  initialValue: T;
  mutationFn: (value: T) => Promise<any>;
  debounceTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useAutoSave = <T extends SaveableValue>({
  initialValue,
  mutationFn,
  debounceTime = 1000,
  onSuccess,
  onError
}: UseAutoSaveOptions<T>) => {
  const [value, setValue] = useState<T>(initialValue);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      setLastSaved(new Date());
      setValue(prevValue => ({ ...(prevValue as object), ...data }));
      onSuccess?.(data);
    },
    onError: (error, variables) => {
      setValue(variables); // Revert to the last known good state
      onError?.(error);
    }
  });

  const debouncedSave = useCallback(
    debounce((newValue: T) => {
      mutation.mutate(newValue);
    }, debounceTime),
    [mutation, debounceTime]
  );

  useEffect(() => {
    if (isInitialized) {
      debouncedSave(value);
    } else {
      setIsInitialized(true);
    }
  }, [value, debouncedSave, isInitialized]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | T
  ) => {
    if (typeof event === 'object' && 'target' in event) {
      const { name, value: inputValue } = event.target;
      setValue(prev =>
        typeof prev === 'object'
          ? { ...prev, [name]: inputValue }
          : inputValue as T
      );
    } else {
      setValue(prev =>
          typeof prev === 'object' && typeof event === 'object'
            ? { ...prev, ...(event as object) }
            : event as T);
    }
  };
  
  return {
    value,
    onChange: handleChange,
    isSaving: mutation.isPending,
    error: mutation.error,
    lastSaved
  };
};

// export interface UseAutoSaveOptions<T> {
//   initialValues: T;
//   mutationFn: (values: T) => Promise<any>;
//   debounceTime?: number;
//   onSuccess?: (data: any) => void;
//   onError?: (error: any) => void;
//   validate?: (values: T) => void | object | Promise<FormikErrors<T>>;
// }

// export const useAutoSave = <T extends object>({
//   initialValues,
//   mutationFn,
//   debounceTime = 1000,
//   onSuccess,
//   onError,
//   validate
// }: UseAutoSaveOptions<T>) => {
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   const mutation = useMutation({
//     mutationFn,
//     onSuccess: (data) => {
//       setLastSaved(new Date());
//       formik.setValues({ ...formik.values, ...data });
//       onSuccess?.(data);
//     },
//     onError: (error) => {
//       onError?.(error);
//     }
//   });

//   const debouncedSave = useCallback(
//     debounce((values: T) => {
//       mutation.mutate(values);
//     }, debounceTime),
//     [mutation, debounceTime]
//   );

//   const formik = useFormik({
//     initialValues,
//     validate,
//     onSubmit: () => {}, // We're not using a submit handler in this case
//   });

//   useEffect(() => {
//     if (formik.dirty && !formik.isValidating) {
//       debouncedSave(formik.values);
//     }
//   }, [formik.values, formik.dirty, formik.isValidating, debouncedSave]);

//   return {
//     ...formik,
//     isSaving: mutation.isPending,
//     error: mutation.error,
//     lastSaved
//   };
// };
export function useHTMLToMarkdownConverter() {
  const [html, setHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const turndownService = useMemo(() => new TurndownService(), []);

  // Add rules to handle specific HTML elements or attributes
  useEffect(() => {
    turndownService.addRule("heading", {
      filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
      replacement: function (content, node, options) {
        const hLevel = +node.nodeName.charAt(1);
        const hPrefix = "#".repeat(hLevel);
        return `\n${hPrefix} ${content}\n`;
      },
    });

    turndownService.addRule("paragraph", {
      filter: "p",
      replacement: function (content) {
        return `\n${content}\n`;
      },
    });
  }, [turndownService]);

  useEffect(() => {
    if (html) {
      setMarkdown(turndownService.turndown(html));
    }
  }, [html, turndownService]);

  const updateHtml = useCallback((newHtml: string) => {
    setHtml(newHtml);
  }, []);

  return { markdown, updateHtml };
}
export function usePosts() {
  const [posts, setPosts] = useState<PostSelect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        console.log({posts:data.posts,p:data.p});
        
        setPosts(data.posts)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const refreshPosts = () => {
    setLoading(true)
    router.refresh()
  }

  return { posts, loading, error, refreshPosts }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        const data = await response.json()
        setPost(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const refreshPost = () => {
    setLoading(true)
    router.refresh()
  }

  return { post, loading, error, refreshPost }
}


export function useDebounce<T extends string | number | object>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}


type QueryParamValue = string | number | boolean | null;

interface QueryParams {
  [key: string]: QueryParamValue;
}

export function useQueryParams<T extends QueryParams>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryParamsValues, setQueryParamsValues] = useState<T>({} as T);

  // Parse search params into an object
  useEffect(() => {
    const params: QueryParams = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setQueryParamsValues(params as T);
  }, [searchParams]);

  // Update a single query parameter
  const setQueryParam = useCallback(
    (key: keyof T, value: QueryParamValue) => {
      const updatedParams = new URLSearchParams(searchParams.toString());

      if (value === null || value === '') {
        updatedParams.delete(key as string);
      } else {
        updatedParams.set(key as string, value.toString());
      }

      router.push(`${pathname}?${updatedParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Update multiple query parameters at once
  const setQueryParams = useCallback(
    (newParams: Partial<T>) => {
      const updatedParams = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '') {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, value.toString());
        }
      });

      router.push(`${pathname}?${updatedParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Clear all query parameters
  const clearQueryParams = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { queryParams: queryParamsValues, setQueryParam, setQueryParams, clearQueryParams };
}