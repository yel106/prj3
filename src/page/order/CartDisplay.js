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

function MyNumberInput({ max, onQuantityChange, cartItemId }) {
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

  React.useEffect(() => {
    onQuantityChange(value);
  }, [value, onQuantityChange]);

  const handleAddCount = () => {
    axios.post(`/cart/addCount/${cartItemId}`).then(() => {
      onQuantityChange(value + 1);
    }); //TODO: 가지고 있는 수량 초과시 OutofStockException 발생하도록 함, 토스트로 불가능하다고 알리고 버튼에 조치
  };

  const handleSubtractCount = () => {
    axios.post(`/cart/subtractCount/${cartItemId}`).then(() => {
      onQuantityChange(value - 1);
    }); //TODO: 가지고 있는 수량 초과시 OutofStockException 발생하도록 함, 토스트로 불가능하다고 알리고 버튼에 조치
  };

  return (
    <>
      <IconButton
        {...inc}
        aria-label="inc"
        icon={<AddIcon />}
        onClick={handleAddCount}
      />
      <Input {...input} readOnly />
      <IconButton
        {...dec}
        aria-label="dec"
        icon={<MinusIcon />}
        onClick={handleSubtractCount}
      />
    </>
  );
}

export function CartDisplay({ accessToken }) {
  const [quantities, setQuantities] = useState({});
  const [items, setItems] = useState([]);
  const toast = useToast();
  // const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("/cart/fetch", {
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

  const totalPrice = items.reduce((total, item) => {
    return total + (quantities[item.name] || 0) * item.price;
  }, 0);

  //TODO: 위 두 개는 OrderWrite 쪽으로 옮겨서 전달하는 방식으로 수정

  const formattedTotalPrice = totalPrice.toLocaleString();

  //TODO: 취소 가능하도록 아이템 삭제하는 함수 완성하기

  // const handleDelete = (itemName) => {
  //   axios.delete(`/cart/delete/${cartItemId}`)
  //       .then()
  //       .catch()
  //       .finally(() => console.log("아이템 삭제 완료"));
  //
  //   setQuantities((prevQuantities) => {
  //     const { [itemName]: deletedItem, ...rest } = prevQuantities;
  //     onTotalChange(calculateTotalPrice(rest), calculateTotalQuantity(rest));
  //     return rest;
  //   });
  // }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">카트 주문명</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {items.map((item, index) => (
            <Box key={index}>
              <Heading size="xs">{item.title}</Heading>
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
                {/*<IconButton onClick={onDelete} aria-label="delete" icon={<CloseIcon />} />*/}
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
