import { PostSelect } from "@/src/types";
import { Link } from "@chakra-ui/next-js";
import {
  Avatar,
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { LuBookmark } from "react-icons/lu";

export default function NewPostCard({
  post,
  showAuthor = true,
  showBookmark = true,
}: {
  showAuthor?: boolean;
  showBookmark?: boolean;
  post: PostSelect;
}) {
  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Stack
      borderRadius="2xl"
      overflow="hidden"
      bg={bgColor}
      position="relative"
      shadow="md"
      p={3}
      spacing={4}
      as={LinkBox}
    >
      <Box pos="relative" h="200px">
        {post?.category && post?.category?.name && (
          <Box position="absolute" top={3} right={3} zIndex={1}>
            <Tag
              size="md"
              colorScheme="blue"
              bg="white"
              color="blue.500"
              borderRadius="full"
              px={3}
              py={1}
              ring={1}
              ringColor="blue.500"
            >
              {post.category.name}
            </Tag>
          </Box>
        )}
        <Image
          src={post.featured_image?.url || "https://picsum.photos/500/400"}
          alt={post.featured_image?.alt_text || (post.title as string)}
          w="full"
          h="full"
          objectFit="cover"
          rounded="2xl"
        />
      </Box>

      <VStack align="stretch" flex={1} justify="space-between" spacing={2}>
        <Box p={2}>
          <LinkOverlay href={`/post/${post.title}`}>
            <Heading size="md" noOfLines={2} mb={2}>
              {post.title}
            </Heading>
          </LinkOverlay>
          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {post.summary || post.content}
          </Text>
        </Box>
        {(showAuthor || showBookmark) && (
          <HStack
            justify="space-between"
            align="center"
            alignSelf={showAuthor ? undefined : "end"}
            bg="gray.100"
            p={2}
            borderRadius="xl"
          >
            {showAuthor && (
              <HStack spacing={2}>
                <Link href={`/author/${post.author?.username}`}>
                  <Avatar
                    src={post?.author?.avatar}
                    name={post?.author?.name}
                    borderRadius="md"
                    boxSize="32px"
                  />
                </Link>
                <VStack spacing={0} align="start">
                  <Link href={`/author/${post.author?.username}`}>
                    <Text fontWeight="medium" fontSize="sm">
                      {post?.author?.name}
                    </Text>
                  </Link>
                  <Text fontSize="xs" color="gray.500">
                    {post?.published_at
                      ? formatDate(post.published_at)
                      : formatDate(post.updated_at as Date)}
                  </Text>
                </VStack>
              </HStack>
            )}
            <IconButton
              icon={<LuBookmark size={18} />}
              variant="ghost"
              aria-label="Bookmark"
              size="sm"
            />
          </HStack>
        )}
      </VStack>
    </Stack>
  );
}
