import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardList } from "./page/board/BoardList";
import { BoardWrite } from "./page/board/BoardWrite";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import Category_CD from "./page/item/Category_CD";
// import { ItemAllPage } from "./component/ItemAllPage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/*<Route path="/iap" element={<ItemAllPage />} />*/}
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />} />
      <Route path="category/:id" element={<Category_CD />} />
    </Route>,
  ),
);

function App(props) {
  return (
    // <LoginProvider>
    <RouterProvider router={routes} />
    // </LoginProvider>
  );
}
export default App;
