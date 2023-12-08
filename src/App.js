import React from "react";
// import Category_CD from "./page/item/Category_CD";
// import { ItemAllPage } from "./component/ItemAllPage";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider,} from "react-router-dom";
import {MemberSignup} from "./page/member/MemberSignup";
import {HomeLayout} from "./page/layout/HomeLayout";
import {MemberView} from "./page/member/MemberView";
import {MemberEdit} from "./page/member/MemberEdit";
import {MemberList} from "./page/member/MemberList";
import {MemberLogin} from "./page/member/MemberLogin";
import {LogInProvider} from "./component/LogInProvider";
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

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />}></Route>
      <Route path="category/:id" element={<Category_CD />} />
      <Route path="signup" element={<MemberSignup />}></Route>
      <Route path="member/list" element={<MemberList />} />
      <Route path="member" element={<MemberView />} />
      <Route path="medit/:id" element={<MemberEdit />} />
      <Route path="order" element={<OrderWrite />} />
      <Route path="payment" element={<Payment />} />
      <Route path="success" element={<Success />} />
      <Route path="fail" element={<Fail />} />
      {/*<Route path="login" element={<MemberLogin />} />*/}
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
