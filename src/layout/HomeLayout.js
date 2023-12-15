import { Box } from "@chakra-ui/react";
import NavBar from "../page/component/NavBar";
import { Outlet } from "react-router-dom";
import React from "react";

export function HomeLayout() {
  return (
    <Box backgroundColor="beige">
      <NavBar />
      <Outlet />
      <Box mx={{ base: 0, md: 10, lg: 40 }}></Box>
    </Box>
  );
}
//주석
