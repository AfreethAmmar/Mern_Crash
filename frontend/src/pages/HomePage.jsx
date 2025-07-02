import { Link } from "react-router-dom";
import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { useEffect } from "react";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log(fetchProducts, products);
  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8}>
        <Text
          fontSize="30"
          fontWeight="bold"
          textAlign="center"
          bgGradient="linear(to-r, cyan.500, blue.500)"
          bgClip="text"
        >
          Current Product 🚀
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} w="full">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
        {products.length === 0 && (
          <Text
            fontSize="xl"
            color="gray.500"
            textAlign={"center"}
            fontWeight={"bold"}
          >
            No Products Found 😥 {""}
            <Link to={"/create"}>
              <Text as="span" color="blue.500" textDecoration="underline">
                Create a new product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};
export default HomePage;
