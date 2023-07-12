import { useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import ActivityEditor from "_templates/ActivityEditor";
import { getExperienceTypes } from "_services/choices";

const ActivityEditorPage = () => {
  const navigate = useNavigate();
  const { typologies } = useLoaderData();
  const [inputValue, setInputValue] = useState(typologies[0].value);

  const onInputValueChange = (val) => {
    setInputValue(val);
  };

  const onClickHandler = () => {
    navigate(`${inputValue.redirect}`, {
      state: { type: inputValue.type, asModel: false },
    });
  };

  return (
    <ActivityEditor
      inputValue={inputValue}
      onInputValueChange={onInputValueChange}
      options={typologies}
      onClickHandler={onClickHandler}
    />
  );
};

export default ActivityEditorPage;

export const loader = async () => {
  const typologiesData = await getExperienceTypes();

  const typologies = [];

  for (const data of typologiesData) {
    typologies.push({
      label: data[1],
      value: { type: data[1], redirect: "esperienze" },
    });
  }
  typologies.push({
    label: "Tirocini Unipi",
    value: {
      redirect: "tirocini",
      type: "tirocini",
    },
  });
  return { typologies };
};
