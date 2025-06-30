import EditResume from "@/app/edit-resume/EditResume";
import Home from "@/app/home/Home";
import Root from "@/app/root/Root";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/edit-resume",
        Component: EditResume,
      },
    ],
  },
]);
