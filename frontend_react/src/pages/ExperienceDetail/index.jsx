import { useLoaderData, useNavigate } from "react-router-dom";
import useAuth from "_hooks/use-auth";
import { getExperience, getExperienceAttrs } from "_services/activities";
import ExperienceDetail from "../../components/templates/ExperienceDetail";

const ExperienceDetailPage = () => {
  const experience = useLoaderData();
  const navigate = useNavigate();
  const { userIsAuth1, userFullName } = useAuth();

  const userCanUseAsModel = userIsAuth1 && userFullName !== experience.author;

  const backHandler = () => {
    navigate(-1);
  };

  const actionHandler = () => {
    navigate(`/attività-editor/esperienze/${experience.slug}/`, {
      state: { type: experience.type, asModel: true },
    });
  };

  return (
    <ExperienceDetail
      experience={experience}
      clickBackHandler={backHandler}
      clickActionHandler={actionHandler}
      userCanUseAsModel={userCanUseAsModel}
    />
  );
};

export default ExperienceDetailPage;

export const loader = async ({ params }) => {
  const { data: experience } = await getExperience({ slug: params.slug });
  const { attrs } = await getExperienceAttrs({ slug: experience.slug });
  document.title = "Dettagli esperienza " + experience.description;
  return { ...experience, attrs: attrs };
};
