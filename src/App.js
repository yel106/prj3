import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { MemberSignup } from "./page/member/MemberSignup";
import { HomeLayout } from "./page/layout/HomeLayout";
import { MemberView } from "./page/member/MemberView";
import { MemberEdit } from "./page/member/MemberEdit";
import { MemberList } from "./page/member/MemberList";
import { MemberLogin } from "./page/member/MemberLogin";
import { MemeberSocialLogin } from "./MemeberSocialLogin";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HomeLayout />}>
      {/*<Route index element={<BoardList />} />*/}
      {/*<Route path="write" element={<BoardWrite />} />*/}
      {/*<Route path="board/:id" element={<BoardView />} />*/}
      {/*<Route path="edit/:id" element={<BoardEdit />}></Route>*/}
      <Route path="signup" element={<MemberSignup />}></Route>
      <Route path="member/list" element={<MemberList />} />
      <Route path="member" element={<MemberView />} />
      <Route path="medit/:id" element={<MemberEdit />} />
      <Route path="login" element={<MemberLogin />} />
      <Route path="loginprocess" element={<MemeberSocialLogin />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
