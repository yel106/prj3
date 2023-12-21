import { Box, DrawerFooter, Text } from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";

export function HomeLayout() {
  return (
    <>
      <Box colorScheme="red.100">
        <NavBar colorScheme="white" bg="whihe" />
        <Outlet colorScheme="white" />
        <Box mx={{ base: 0, md: 10, lg: 40 }}></Box>
      </Box>
      <Box border={"0px solid gray"} w="100%" h="100px">
        <Box textAlign="flex">
          <Text>Company: 뮤레코드 대표: 주예린</Text>
          <Text>E-mail: muerecords@gmail.com</Text>
          <Text>Address:제주도 서귀포시</Text>
          <Text>Bank info: 국민은행 284002-04-192958</Text>
        </Box>
      </Box>
    </>
  );
}
//주석
