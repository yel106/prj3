import { Box, DrawerFooter, Spacer, Text } from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";

export function HomeLayout() {
  return (
    <>
      <Box>
        <NavBar />
        <Outlet />
      </Box>
      <Spacer h={100} />
      <Box
        w="100%"
        h="100px"
        mt={5}
        textAlign="center"
        backgroundColor="grey"
        color="white"
      >
        <Text>Company: 뮤레코드 대표: 주예린</Text>
        <Text>E-mail: muerecords@gmail.com</Text>
        <Text>Address:제주도 서귀포시</Text>
        <Text>Bank info: 국민은행 284002-04-192958</Text>
      </Box>
    </>
  );
}
//주석
