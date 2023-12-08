import React from 'react';
import {Box} from "@chakra-ui/react";
import {Outlet} from "react-router-dom";
import {NavBar} from "./NavBar";

export function HomeLayout() {
  return (
    <Box>
      <NavBar />
      <Outlet />
    </Box>
  );
}
