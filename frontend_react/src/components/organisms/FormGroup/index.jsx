import FormInput from "_molecules/FormInput";

const FormGroup = ({ className, formRows, title, textTitle }) => {
  return (
    <div className={`form-group ${className}`}>
      {textTitle && !title && <h2>{textTitle}</h2>}
      {title}
      {formRows.map((formRow, index) => (
        <div key={index} className="form-row row">
          {formRow.map((input) => {
            if (input?.isNotInput) {
              return (
                <div
                  key={input.name}
                  className={input.className}
                  {...input?.config}
                >
                  {input?.children}
                </div>
              );
            }
            return (
              <FormInput
                key={input.name}
                className={input.className}
                inputChangeHandler={input.inputChangeHandler}
                inputFocusHandler={input.inputFocusHandler}
                inputBlurHandler={input.inputBlurHandler}
                state={input.state}
                label={input.label}
                config={input?.config}
              >
                {input?.children}
              </FormInput>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default FormGroup;
