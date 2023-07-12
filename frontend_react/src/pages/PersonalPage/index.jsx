import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import useAuth from "_hooks/use-auth";
import { getUserActivities, deleteActivity } from "_services/activities";
import PersonalPage from "_templates/PersonalPage";
import { getInternshipWards, getInternshipYears } from "_services/choices";

const PersonalPageIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loaderData = useLoaderData();
  const { userFullName, userIsAuth1, userIsAuth2, theme } = useAuth();

  const onDeleteHandler = async (slug, to) => {
    await deleteActivity({ slug, to });
    navigate("/area-personale", { state: { to: to } });
  };

  return (
    <PersonalPage
      userIsAuth1={userIsAuth1}
      userIsAuth2={userIsAuth2}
      userFullName={userFullName}
      theme={theme}
      to={location.state?.to}
      data={{
        experiences: loaderData.experiences,
        "unipi-internships": loaderData.internships,
      }}
      wards={loaderData.wards}
      years={loaderData.years}
      deleteFn={deleteActivity}
      onDeleteHandler={onDeleteHandler}
    />
  );
};

export default PersonalPageIndex;

export const loader = async () => {
  const wards = await getInternshipWards();
  const years = await getInternshipYears();
  const experiencesData = await getUserActivities("experiences");
  const internshipsData = await getUserActivities("internships");

  document.title = "Area Personale";

  return {
    wards,
    years,
    experiences: experiencesData.data,
    internships: internshipsData.data,
  };
};
