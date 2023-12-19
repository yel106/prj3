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
import { AddIcon, CloseIcon, MinusIcon } from "@chakra-ui/icons";
import { useNumberInput } from "@chakra-ui/react";
import axios from "axios";

function MyNumberInput({ cartItemId, accessToken, count, fetchList, toast }) {
  const handleAddCount = () => {
    axios
      .get(`/cart/addCount/${cartItemId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        console.log("증가");
      })
      .catch(() => {
        toast({
          title: "재고가 없습니다",
          description: "자세한 사항은 관리자를 통해 문의하세요.",
          status: "error",
          position: "top",
        });
      })
      .finally(() => fetchList());
  };

  //오더 네임, 총 가격 넘기기

  const handleSubtractCount = () => {
    if (count !== 1) {
      axios
        .get(`/cart/subtractCount/${cartItemId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(() => {
          console.log("감소");
          fetchList();
        })
        .catch(() => {})
        .finally(() => fetchList());
    } else {
      toast({
        title: "한 개 이상 주문 가능합니다",
        position: "top",
        description: "취소를 원하시면 x 버튼을 눌러주세요.",
        status: "error",
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="inc"
        icon={<AddIcon />}
        onClick={handleAddCount}
        variant="outline"
      />
      <Text width="20px" textAlign="center">
        {count}
      </Text>
      <IconButton
        aria-label="dec"
        icon={<MinusIcon />}
        variant="outline"
        onClick={handleSubtractCount}
      />
    </>
  );
}

export function CartDisplay({ accessToken }) {
  const [items, setItems] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchList();
  }, []);

  function fetchList() {
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
  }

  const totalPrice = items.reduce((total, item) => {
    return total + (item.count || 0) * item.price;
  }, 0);

  const formattedTotalPrice = totalPrice.toLocaleString();
  //TODO : totalPrice 넘기기
  //TODO : item.title + 외 items.map.size() 건 으로 스트링 조합해서 주문건으로 넘기기 <- 얘로 타이틀
  //TODO :

  function handleDeleteItem({ item }) {
    console.log(item.title + "삭제 요청 전송하는 함수");

    axios
      .delete(`/cart/delete/${item.cartItemId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        toast({
          description: "성공적으로 삭제했습니다.",
          status: "success",
        });

        //
      })
      .catch((error) => {
        console.log(error.response.data);
        toast({
          description: "삭제 요청 중 에러가 발생했습니다.",
          status: "error",
        });
      })
      .finally(() => {
        console.log("삭제 요청 끝");
        fetchList();
      });
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">카트 주문명</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {items.map((item, index) => (
            <Box key={index}>
              <Heading size="sm" mb="2">
                {item.title}
              </Heading>
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
                    count={item.count}
                    accessToken={accessToken}
                    cartItemId={item.cartItemId}
                    fetchList={fetchList}
                    toast={toast}
                  />
                </HStack>
                <Text fontWeight="bold" fontSize="lx">
                  {item.price.toLocaleString()} 원
                </Text>
                <IconButton
                  onClick={() => handleDeleteItem({ item })}
                  aria-label="delete"
                  variant="ghost"
                  color="red"
                  icon={<CloseIcon fontSize="xs" />}
                />
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
