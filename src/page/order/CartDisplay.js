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

export function CartDisplay() {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: 6,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const items = [
    { name: "item1", info: "info" },
    { name: "item2", info: "item2 info" },
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
              <HStack>
                <Text pt="2" fontSize="sm">
                  {item.info}
                </Text>
                <HStack maxW="320px">
                  <IconButton {...inc} aria-label="inc" icon={<AddIcon />} />
                  <Input {...input} />
                  <IconButton {...dec} aria-label="dec" icon={<MinusIcon />} />
                </HStack>
              </HStack>
            </Box>
          ))}
        </Stack>
      </CardBody>
      <CardFooter>
        <HStack justifyContent="flex-end">
          <Heading size="md">Price:</Heading>
          <Heading size="md">200,000원</Heading>
        </HStack>
      </CardFooter>
    </Card>
  );
}
