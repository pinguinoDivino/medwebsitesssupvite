import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useAuth from "_hooks/use-auth";

import { DpcProtected } from "_pages/Protected";
import RootLayout from "_pages/RootLayout";
import Home from "_pages/Home";
import Experiences, { loader as experiencesLoader } from "_pages/Experiences";
import Internships, { loader as internshipsLoader } from "_pages/Internships";
import ExperienceDetail, {
  loader as experienceDetailLoader,
} from "_pages/ExperienceDetail";
import ActivityEditor, {
  loader as activityEditorLoader,
} from "_pages/ActivityEditor";
import ExperienceEditor, {
  loader as experienceEditorLoader,
} from "_pages/ExperienceEditor";
import InternshipEditor, {
  loader as internshipEditorLoader,
} from "_pages/InternshipEditor";
import PersonalPage, {
  loader as personalPageLoader,
} from "_pages/PersonalPage";
import Error from "_pages/Error";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "esperienze",
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: (
              <DpcProtected>
                <Experiences />
              </DpcProtected>
            ),
            loader: experiencesLoader,
          },
          {
            path: ":slug",
            element: (
              <DpcProtected>
                <ExperienceDetail />
              </DpcProtected>
            ),
            loader: experienceDetailLoader,
          },
        ],
      },
      {
        errorElement: <Error />,
        path: "tirocini-curricolari",
        element: (
          <DpcProtected>
            <Internships />
          </DpcProtected>
        ),
        loader: internshipsLoader,
      },
      {
        path: "attività-editor",
        elementError: <Error />,
        children: [
          {
            index: true,
            element: (
              <DpcProtected>
                <ActivityEditor />
              </DpcProtected>
            ),
            loader: activityEditorLoader,
          },
          {
            path: "esperienze/:slug?",
            element: (
              <DpcProtected>
                <ExperienceEditor />
              </DpcProtected>
            ),
            loader: experienceEditorLoader,
          },
          {
            path: "tirocini/:slug?",
            element: (
              <DpcProtected>
                <InternshipEditor />
              </DpcProtected>
            ),
            loader: internshipEditorLoader,
          },
        ],
      },
      {
        path: "area-personale",
        elementError: <Error />,
        element: (
          <DpcProtected>
            <PersonalPage />
          </DpcProtected>
        ),
        loader: personalPageLoader,
      },
    ],
  },
]);

const App = () => {
  useAuth();
  return <RouterProvider router={router} />;
};

export default App;
