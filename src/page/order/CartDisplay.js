import React from "react";
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
  useNumberInput,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import * as PropTypes from "prop-types";

function MyNumberInput({ max }) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: max,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();
  return (
    <>
      <IconButton {...inc} aria-label="inc" icon={<AddIcon />} />
      <Input {...input} readOnly />
      <IconButton {...dec} aria-label="dec" icon={<MinusIcon />} />
    </>
  );
}

export function CartDisplay() {
  const items = [
    { name: "item1", info: "info", max: 6, price: 12000 },
    { name: "item2", info: "item2 info", max: 8, price: 15000 },
  ];

  return (
    <Card>
      <CardHeader>
        <Heading size="md">카트 주문명</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {items.map((item, index) => (
            <Box key={index}>
              <Heading size="xs" textTransform="uppercase">
                {item.name}
              </Heading>
              <HStack justifyContent="space-between">
                <Text pt="2" fontSize="sm">
                  {item.info}
                </Text>
                <HStack maxW="150px">
                  <MyNumberInput max={item.max} value="quantity" />
                </HStack>
                <Text fontWeight="bold" fontSize="lx">
                  {item.price} 원
                </Text>
              </HStack>
            </Box>
          ))}
        </Stack>
      </CardBody>
      <CardFooter>
        <HStack justifyContent="space-between" width="100%">
          <Heading size="md">Price:</Heading>
          <Heading size="md" textAlign="right">
            200,000원
          </Heading>
        </HStack>
      </CardFooter>
    </Card>
  );
}
