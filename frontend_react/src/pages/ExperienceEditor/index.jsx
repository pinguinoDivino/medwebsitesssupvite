import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import useForm from "_hooks/use-form";
import {
  getCities,
  getCountries,
  getTagGroups,
  getTags,
  getUniversities,
} from "_services/choices";
import useAuth from "_hooks/use-auth";
import {
  getExperience,
  getExperienceAttrs,
  putExperience,
} from "_services/activities";
import {
  noValidation,
  isEmpty,
  isLink,
  areUniqueItems,
} from "_/common/validators";
import { getEditDateFormat } from "_/common/utils";
import ExperienceEditor from "_templates/ExperienceEditor";
import { useState } from "react";

const validators = {
  description: isEmpty,
  author_contact: isEmpty,
  started_at: isEmpty,
  ended_at: isEmpty,
  ref: isEmpty,
  reviewA: isEmpty,
  reviewB: isEmpty,
  reviewC: isEmpty,
  indications: isEmpty,
  global_r: isEmpty,
  stay_r: isEmpty,
  acquired_knowledge_r: isEmpty,
  involvement_r: isEmpty,
  institution: isEmpty,
  thesis: noValidation,
  ward: isEmpty,
  title: isEmpty,
  link: isLink,
  cost: isEmpty,
  organization: isEmpty,
  link_organization: isLink,
  univ_ids: areUniqueItems,
  city_id: isEmpty,
  img: noValidation,
  tags: areUniqueItems,
};

const cityCreationValidators = {
  country: isEmpty,
  region: isEmpty,
  city: isEmpty,
};

const tagCreationValidators = {
  group: isEmpty,
  name: isEmpty,
};

const typeSwitcher = (attr) => {
  switch (attr) {
    case "SFS":
      return "sfs";
    case "Erasmus":
      return "erasmus";
    case "Laboratorio":
      return "lab";
    case "Summer School":
      return "summerschool";
    case "Congresso":
      return "congress";
    case "Tirocinio":
      return "internship";
    default:
      return attr;
  }
};

const ExperienceEditorPage = () => {
  const {
    previousExperience,
    universities,
    cities,
    tags,
    countries,
    tagGroups,
  } = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  const experienceType = location.state.type;
  const isModel = location.state?.asModel;

  const isSfsErasmusLab =
    experienceType === "SFS" ||
    experienceType === "Erasmus" ||
    experienceType === "Laboratorio";

  const isCongress =
    experienceType === "Congresso" || experienceType === "Summer School";

  const isInternship = experienceType === "Tirocinio";

  const {
    stateForm,
    inputChangeHandler,
    inputFocusHandler,
    inputBlurHandler,
    inputListAddHandler,
    inputListRemoveHandler,
    submitDataHandler,
    nonFieldBackendError,
  } = useForm(
    {
      description: previousExperience ? previousExperience.description : "",
      author_contact:
        previousExperience && !isModel
          ? previousExperience.author_contact
          : userEmail,
      started_at:
        previousExperience && !isModel
          ? getEditDateFormat(previousExperience.started_at)
          : "",
      ended_at:
        previousExperience && !isModel
          ? getEditDateFormat(previousExperience.ended_at)
          : "",
      ref: previousExperience ? previousExperience.ref : "",
      reviewA:
        previousExperience && !isModel
          ? previousExperience.review.split("&r)")[1]
          : "",
      reviewB:
        previousExperience && !isModel
          ? previousExperience.review.split("&r)")[2]
          : "",
      reviewC:
        previousExperience && !isModel
          ? previousExperience.review.split("&r)")[3]
          : "",
      indications:
        previousExperience && !isModel ? previousExperience.indications : "",
      global_r:
        previousExperience && !isModel ? previousExperience.rating.global_r : 0,
      stay_r:
        previousExperience && !isModel ? previousExperience.rating.stay_r : 0,
      acquired_knowledge_r:
        previousExperience && !isModel
          ? previousExperience.rating.acquired_knowledge_r
          : 0,
      involvement_r:
        previousExperience && !isModel
          ? previousExperience.rating.involvement_r
          : 0,

      [(isSfsErasmusLab || isInternship) && "institution"]: {
        value: previousExperience ? previousExperience.attrs.institution : "",
        attr: true,
      },
      [isSfsErasmusLab && "thesis"]: {
        value: previousExperience
          ? String(previousExperience.attrs.thesis)
          : null,
        attr: true,
      },
      [isInternship && "ward"]: {
        value: previousExperience ? previousExperience.attrs.ward : "",
        attr: true,
      },
      [isCongress && "title"]: {
        value: previousExperience ? previousExperience.attrs.title : "",
        attr: true,
      },
      [isCongress && "link"]: {
        value: previousExperience ? previousExperience.attrs.link : "",
        attr: true,
      },
      [isCongress && "cost"]: {
        value: previousExperience ? previousExperience.attrs.cost : 0,
        attr: true,
      },
      [isCongress && "organization"]: {
        value: previousExperience ? previousExperience.attrs.organization : "",
        attr: true,
      },
      [isCongress && "link_organization"]: {
        value: previousExperience
          ? previousExperience.attrs.link_organization
          : "",
        attr: true,
      },
      univ_ids: previousExperience
        ? previousExperience.universities.map((univ) => univ.id)
        : [],
      city_id: previousExperience ? previousExperience.city.id : "",
      img: previousExperience && !isModel ? previousExperience.img : null,
      tags: previousExperience
        ? previousExperience.tags.map((tag) => tag.name)
        : [],
    },
    validators
  );

  const onBackClickHandler = () => {
    navigate(-1);
  };

  const [tagList, setTagList] = useState(tags);
  const [cityList, setCityList] = useState(cities);

  const onNewTagHandler = (tagData) => {
    setTagList((prev) => [...prev, { ...tagData }]);
    inputListAddHandler("tags", tagData.name);
  };

  const onNewCityHandler = (cityData) => {
    setCityList((prev) => [...prev, { ...cityData }]);
    inputChangeHandler("city_id", cityData.id);
  };

  const onSubmitDataHandler = async () => {
    const cleanFunc = (data) => {
      const newData = { ...data, type: experienceType };

      newData["type"] = typeSwitcher(newData["type"]);
      newData["review"] =
        "&r)" +
        newData.reviewA +
        "&r)" +
        newData.reviewB +
        "&r)" +
        newData.reviewC;

      newData["rating"] = JSON.stringify({
        global_r: newData.global_r,
        stay_r: newData.stay_r,
        acquired_knowledge_r: newData.acquired_knowledge_r,
        involvement_r: newData.involvement_r,
      });
      newData["tags"] = JSON.stringify(
        tagList.filter((tag) => newData.tags.includes(tag.name))
      );

      const attrs = {};
      Object.keys(stateForm).map((key) => {
        if (stateForm[key]?.attr) {
          attrs[key] = newData[key];
          delete newData[key];
        }
      });

      delete newData.reviewA;
      delete newData.reviewB;
      delete newData.reviewC;
      delete newData.global_r;
      delete newData.stay_r;
      delete newData.acquired_knowledge_r;
      delete newData.involvement_r;

      return { data: newData, attrs };
    };

    await submitDataHandler(
      putExperience,
      "slug",
      isModel ? null : previousExperience,
      "experiences",
      cleanFunc
    );
  };

  return (
    <ExperienceEditor
      experienceType={experienceType}
      isSfsErasmusLab={isSfsErasmusLab}
      isCongress={isCongress}
      isInternship={isInternship}
      inputBlurHandler={inputBlurHandler}
      inputFocusHandler={inputFocusHandler}
      inputChangeHandler={inputChangeHandler}
      inputListAddHandler={inputListAddHandler}
      inputListRemoveHandler={inputListRemoveHandler}
      stateForm={stateForm}
      universities={universities}
      cities={cityList}
      countries={countries}
      tagGroups={tagGroups}
      tags={tagList}
      onNewTagHandler={onNewTagHandler}
      onNewCityHandler={onNewCityHandler}
      onBackClickHandler={onBackClickHandler}
      onSubmitDataHandler={onSubmitDataHandler}
      tagCreationValidators={tagCreationValidators}
      cityCreationValidators={cityCreationValidators}
      nonFieldBackendError={nonFieldBackendError}
    />
  );
};

export default ExperienceEditorPage;

export const loader = async ({ params }) => {
  const universities = await getUniversities();
  const cities = await getCities();
  const countries = await getCountries();
  const tagGroups = await getTagGroups();
  const tags = await getTags("experience");
  if (params.slug) {
    const { data: experience } = await getExperience({ slug: params.slug });
    const { attrs } = await getExperienceAttrs({ slug: experience.slug });
    document.title = "Modifica esperienza " + experience.description;
    return {
      previousExperience: { ...experience, attrs: attrs },
      universities,
      cities,
      tags,
      countries,
      tagGroups,
    };
  }
  document.title = "Aggiungi esperienza";
  return {
    previousExperience: null,
    universities,
    cities,
    tags,
    countries,
    tagGroups,
  };
};
