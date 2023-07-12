import { useState, useEffect } from "react";
import Modal from "_atoms/Modal";
import useForm from "_hooks/use-form";
import TextButton from "_atoms/TextButton";
import FormInput from "_molecules/FormInput";

const ModalCreation = ({
  initialState,
  initialIsOpenState,
  buttonText,
  buttonMode,
  validators,
  inputs,
  title,
  submitDataFunction,
  onSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(
    initialIsOpenState ? initialIsOpenState : false
  );
  const [formInputs, setFormInputs] = useState(null);

  const {
    stateForm,
    getFormData,
    inputFocusHandler,
    inputBlurHandler,
    inputChangeHandler,
    inputListAddHandler,
    inputListRemoveHandler,
    djangoBackendErrorsHandler,
    nonFieldBackendError,
  } = useForm(initialState, validators);

  useEffect(() => {
    setFormInputs(
      inputs.map((input) => {
        return {
          ...input,
          state: stateForm[input.name],
          inputFocusHandler: inputFocusHandler.bind(this, input.name),
          inputBlurHandler: inputBlurHandler.bind(this, input.name),
          inputChangeHandler: input?.config?.multiple
            ? inputListAddHandler.bind(this, input[name])
            : inputChangeHandler.bind(this, input.name),
          config: {
            ...input.config,
            //TODO ADD INPUT LIST REMOVE HANDLER
            // [input?.config?.multiple && "inputListRemoveHandler"]:
            //  inputListRemoveHandler(this, input[name]),
          },
        };
      })
    );
    return () => setFormInputs(null);
  }, [inputs, stateForm]);

  const onSubmitDataHandler = async () => {
    const data = getFormData((data) => data);
    try {
      const response = await submitDataFunction({ data });
      const responseData = await response.data;
      onSubmit(responseData);
      setIsOpen(false);
    } catch (e) {
      djangoBackendErrorsHandler(e);
    }
  };

  return (
    <>
      <TextButton
        onClick={setIsOpen.bind(this, true)}
        mode={buttonMode}
        type="button"
      >
        {buttonText}
      </TextButton>
      {isOpen && (
        <Modal title={title} onClose={setIsOpen.bind(this, false)}>
          <div className="p-1">
            <form>
              {formInputs &&
                formInputs.map((formInput) => (
                  <FormInput key={formInput.name} {...formInput} />
                ))}
            </form>
            {nonFieldBackendError && (
              <div className="row form-row">
                <div className="col-12">
                  <p className="not-found">{nonFieldBackendError}</p>
                </div>
              </div>
            )}
            <div className="row form-group mt-1">
              <div className="col-4 col-sm-3 col-md-2">
                <TextButton mode="danger" onClick={setIsOpen.bind(this, false)}>
                  Indietro
                </TextButton>
              </div>
              <div className="col-4 col-sm-3 col-md-2">
                <TextButton
                  mode="success"
                  onClick={onSubmitDataHandler}
                  type="button"
                >
                  Salva
                </TextButton>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default ModalCreation;
