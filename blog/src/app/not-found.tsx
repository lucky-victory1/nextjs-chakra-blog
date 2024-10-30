"use client";
import { NextPage } from "next";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const NotFound: NextPage = () => {
  const router = useRouter();

  return (
    <Container maxW="container.xl" h="100vh" centerContent>
      <VStack spacing={8} align="center" justify="center" h="full">
        <Image
          src="/404-illustration.svg"
          alt="404 Illustration"
          boxSize="300px"
        />
        <Heading as="h1" size="2xl" textAlign="center">
          Oops! Page Not Found
        </Heading>
        <Text fontSize="xl" textAlign="center" maxW="600px">
          We couldn&apos;t find the page you&apos;re looking for. It might have
          been removed, renamed, or doesn&apos;t exist.
        </Text>
        <Box>
          <Button
            rounded={"full"}
            size="lg"
            onClick={() => router.push("/")}
            mr={4}
          >
            Go Home
          </Button>
          <Button
            rounded={"full"}
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFound;