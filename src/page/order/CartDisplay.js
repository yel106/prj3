import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
  Box,
  Text,
  HStack,
  IconButton,
  Input,
  Image,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { useNumberInput } from "@chakra-ui/react";
import axios from "axios";
import toast from "bootstrap/js/src/toast";

function MyNumberInput({ max, onQuantityChange }) {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: max,
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  // Notify the parent component of quantity changes
  React.useEffect(() => {
    onQuantityChange(value);
  }, [value, onQuantityChange]);

  return (
    <>
      <IconButton {...inc} aria-label="inc" icon={<AddIcon />} />
      <Input {...input} readOnly />
      <IconButton {...dec} aria-label="dec" icon={<MinusIcon />} />
    </>
  );
}

export function CartDisplay() {
  const [quantities, setQuantities] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    axios
      .post("/cart/fetch", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => setItems(response.data))
      .catch((error) => {
        console.log(error.response.data);
        toast({
          description: "상품 불러오기에 실패했습니다.",
          status: "error",
        });
      });
  }, []);

  // const items = [
  //   { name: "item1", info: "info", max: 6, price: 12000, fileUrl: "1" },
  //   { name: "item2", info: "item2 info", max: 8, price: 15000, fileUrl: "2" },
  // ];

  const handleQuantityChange = (itemName, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemName]: quantity,
    }));
  };

  // Calculate total price based on quantities and item prices
  const totalPrice = items.reduce((total, item) => {
    return total + (quantities[item.name] || 0) * item.price;
  }, 0);

  // Format the total price with commas
  const formattedTotalPrice = totalPrice.toLocaleString();

  return (
    <Card>
      <CardHeader>
        <Heading size="md">카트 주문명</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {items.map((item, index) => (
            <Box key={index}>
              <Heading size="xs">{item.name}</Heading>
              <HStack justifyContent="space-between">
                <Image
                  src={item.fileUrl}
                  alt={`Thumbnail for ${item.name}`}
                  boxSize="30px"
                  border="1px solid red"
                />
                <Box flex="1" marginLeft="4">
                  <Text pt="2" fontSize="sm">
                    {item.info}
                  </Text>
                </Box>
                <HStack maxW="150px">
                  <MyNumberInput
                    max={item.max}
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(item.name, quantity)
                    }
                  />
                </HStack>
                <Text fontWeight="bold" fontSize="lx">
                  {item.price.toLocaleString()} 원
                </Text>
              </HStack>
            </Box>
          ))}
        </Stack>
      </CardBody>
      <CardFooter>
        <HStack justifyContent="space-between" width="100%">
          <Heading size="md">Total Price:</Heading>
          <Heading size="md" textAlign="right">
            {formattedTotalPrice} 원
          </Heading>
        </HStack>
      </CardFooter>
    </Card>
  );
}
