import { useState } from "react";
import RadioInput from "_atoms/RadioInput";
import TextButton from "_atoms/TextButton";

const DpcForm = ({ submitDpcData, className }) => {
  const [dpcInput, setDpcInput] = useState(false);

  const onChangeHandler = (val) => {
    setDpcInput(val === "true");
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    submitDpcData({ dpc: dpcInput });
  };

  return (
    <div className={`p-1 ${className}`}>
      <h2>Trattamento dati</h2>
      <p>
        Non hai ancora acconsentito al
        <a target="_blank" href="/accounts/trattamento-dati/">
          {" "}
          trattamento dati
        </a>
        , finchè non lo autorizzi{" "}
        <span className="bold">
          non ti sarà concesso di proseguire nel sito.
        </span>
      </p>
      <form onSubmit={onSubmitHandler}>
        <h3>Autorizzi al trattamento dati?</h3>
        <RadioInput
          label="Accetto"
          value={true}
          isChecked={dpcInput}
          onChangeHandler={onChangeHandler}
        />
        <RadioInput
          label="Rifiuto"
          value={false}
          isChecked={!dpcInput}
          onChangeHandler={onChangeHandler}
        />
        <TextButton type="submit" mode="primary">
          Salva
        </TextButton>
      </form>
    </div>
  );
};

export default DpcForm;
