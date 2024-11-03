import React, { useEffect, useState } from "react";
import { MediaCard } from "./MediaCard";
import { MediaFilter } from "./MediaFilter";
import { Box, Button, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuLoader2,
  LuTrash,
  LuTrash2,
} from "react-icons/lu";
import { useDebounce } from "@/src/hooks";
import { FilterParams, MediaResponse, PaginatedResponse } from "@/src/types";
import axios from "axios";
import Loader from "../../Loader";

interface MediaLibraryProps {
  onSelect?: (media: MediaResponse | MediaResponse[]) => void;
  multiple?: boolean;
  defaultFilters?: Partial<FilterParams>;
  maxSelection?: number;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  multiple = false,
  defaultFilters = {},
  maxSelection,
}) => {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 20,
    ...defaultFilters,
  });
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<PaginatedResponse<MediaResponse>>();
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse[]>([]);
  const [folders, setFolders] = useState<string[]>([]);

  const debouncedFilters = useDebounce(filters, 300);

  const fetchFolders = async () => {
    try {
      const { data } = await axios<{ data: string[] }>(`/api/media/folders`);

      setFolders(data?.data);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };
  const fetchMedia = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else if (value) {
          queryParams.append(key, value.toString());
        }
      });

      const { data: media } = await axios(`/api/media?${queryParams}`);

      setMedia(media);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset page when filters change
    }));
  };

  const handleSelect = (media: MediaResponse) => {
    if (multiple) {
      setSelectedMedia((prev) => {
        const isSelected = prev.find((m) => m.id === media.id);
        if (isSelected) {
          return prev.filter((m) => m.id !== media.id);
        }

        if (maxSelection && prev.length >= maxSelection) {
          // Remove the first item and add the new one at the end
          const newArray = [...prev.slice(1), media];
          return newArray;
        }
        return [...prev, media];
      });
    } else {
      onSelect?.(media);
    }
  };

  const handleLoadMore = () => {
    if (media && media.meta.page < media.meta.totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page ? prev.page + 1 : 2,
      }));
    }
  };
  useEffect(() => {
    fetchMedia();
  }, [debouncedFilters]);
  useEffect(() => {
    fetchFolders();
  }, []);
  return (
    <Box className="space-y-6">
      <MediaFilter onFilterChange={handleFilterChange} folders={folders} />

      {loading && (
        <VStack justify={"center"} py={12}>
          <Loader />
        </VStack>
      )}

      {!loading && media && media?.data?.length === 0 && (
        <VStack justify={"center"} py={12}>
          <Text color={"gray.400"} fontWeight={500}>
            No media found
          </Text>
        </VStack>
      )}
      {!loading && media && media?.data?.length > 0 && (
        <>
          <Grid
            rounded={{ base: 20, md: 24 }}
            bg={"gray.100"}
            p={{ base: 3, md: 4 }}
            templateColumns={{
              // base: "1fr",
              sm: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
            gap={{ base: 3, md: 4 }}
          >
            {media?.data.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                onSelect={handleSelect}
                selected={!!selectedMedia.find((m) => m.id === item.id)}
              />
            ))}
          </Grid>
          <HStack spacing={2} justify={"center"}>
            <Button
              rounded={"full"}
              variant="outline"
              onClick={() => setFilters((prev) => ({ ...prev, page: 1 }))}
              isDisabled={loading || media?.meta.page === 1}
            >
              <LuChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              rounded={"full"}
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page ? prev.page - 1 : 1,
                }))
              }
              isDisabled={loading || media?.meta.page === 1}
            >
              <LuChevronLeft className="h-4 w-4" />
            </Button>
            <Text>
              Page {media?.meta.page} of {media?.meta.totalPages}
            </Text>
            <Button
              rounded={"full"}
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page ? prev.page + 1 : 2,
                }))
              }
              isDisabled={
                loading || media?.meta.page === media?.meta.totalPages
              }
            >
              <LuChevronRight className="h-4 w-4" />
            </Button>
            <Button
              rounded={"full"}
              variant="outline"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: media?.meta.totalPages,
                }))
              }
              isDisabled={
                loading || media?.meta.page === media?.meta.totalPages
              }
            >
              <LuChevronsRight className="h-4 w-4" />
            </Button>
          </HStack>{" "}
        </>
      )}

      {multiple && selectedMedia.length > 0 && (
        <Box
          bottom={"env(safe-area-inset-bottom,0px)"}
          className="sticky left-0 right-0 p-4 bg-white border-t shadow-lg"
          roundedTop={"lg"}
        >
          <HStack
            direction={{ base: "column", md: "row" }}
            maxW={"7xl"}
            mx={"auto"}
            justify={"space-between"}
          >
            {(!maxSelection || maxSelection > 1) && (
              <Text>{selectedMedia.length} items selected</Text>
            )}
            <HStack
              gap={4}
              flex={1}
              justify={"end"}
              align={"stretch"}
              wrap={"wrap"}
            >
              <Button
                rounded={"full"}
                onClick={() => setSelectedMedia([])}
                colorScheme="red"
                leftIcon={<LuTrash2 />}
                variant="outline"
              >
                Clear
              </Button>
              <Button
                rounded={"full"}
                onClick={() => onSelect?.(selectedMedia)}
              >
                Confirm Selection
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
};