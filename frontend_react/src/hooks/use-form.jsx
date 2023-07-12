import { useCallback, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

const initializeForm = (fields, validators) => {
  const initialState = {};
  Object.keys(fields).map((fieldKey) => {
    if (
      typeof fields[fieldKey] === "object" &&
      !Array.isArray(fields[fieldKey]) &&
      fields[fieldKey] !== null &&
      Object.keys(fields[fieldKey]).includes("value")
    ) {
      initialState[fieldKey] = {
        ...fields[fieldKey],
        isValid: false,
        errorText: "",
        isTouched: false,
      };
    } else {
      initialState[fieldKey] = {
        value: fields[fieldKey],
        isValid: false,
        errorText: "",
        isTouched: false,
      };
    }
  });
  if (Object.keys(initialState).includes("false")) {
    delete initialState.false;
  }

  Object.keys(initialState).map((fieldKey) => {
    const { inputIsNotValid, errorText } = validators[fieldKey](
      initialState[fieldKey].value
    );
    initialState[fieldKey].isValid = !inputIsNotValid;
    initialState[fieldKey].errorText = errorText;
  });

  return initialState;
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      const { inputIsNotValid, errorText } = action.validate(action.inputValue);
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          value: action.inputValue,
          isValid: !inputIsNotValid,
          errorText: inputIsNotValid ? errorText : "",
          isTouched: true,
        },
      };
    }
    case "INPUT_LIST_ADD": {
      const { inputIsNotValid, errorText } = action.validate(
        action.inputValue,
        state[action.inputName].value
      );
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          value: [
            ...state[action.inputName].value,
            ...(inputIsNotValid ? [] : [action.inputValue]),
          ],
          isValid: !inputIsNotValid,
          errorText: inputIsNotValid ? errorText : "",
          isTouched: true,
        },
      };
    }
    case "INPUT_LIST_REMOVE": {
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          value: [...state[action.inputName].value].filter(
            (item) => item !== action.inputValue
          ),
          isTouched: true,
        },
      };
    }
    case "INPUT_FOCUS": {
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          isValid: true,
          errorText: "",
          isTouched: true,
        },
      };
    }
    case "INPUT_BLUR": {
      const { inputIsNotValid, errorText } = action.validate(
        state[action.inputName].value
      );
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          isValid: !inputIsNotValid,
          errorText: inputIsNotValid ? errorText : "",
          isTouched: true,
        },
      };
    }
    case "INPUT_BACKEND_ERROR": {
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          isValid: false,
          errorText: Array.isArray(action.error)
            ? action.error.join(" ")
            : typeof action.error === "object"
            ? action.error["non_field_errors"]
            : action.error,
        },
      };
    }

    case "SUBMIT_FORM": {
      return {
        ...state,
        [action.inputName]: {
          ...state[action.inputName],
          isValid: false,
          errorText: Array.isArray(action.error)
            ? action.error.join(" ")
            : typeof action.error === "object"
            ? action.error["non_field_errors"]
            : action.error,
        },
      };
    }
    default:
      return state;
  }
};

const useForm = (initialState, validators) => {
  const navigate = useNavigate();
  const [stateForm, dispatchStateForm] = useReducer(
    formReducer,
    initializeForm(initialState, validators),
    undefined
  );
  const [nonFieldBackendError, setNonFieldBackendError] = useState("");
  const inputChangeHandler = useCallback(
    (name, value) => {
      dispatchStateForm({
        type: "INPUT_CHANGE",
        inputValue: value,
        inputName: name,
        validate: validators[name],
      });
    },
    [validators]
  );

  const inputListAddHandler = useCallback(
    (name, value) => {
      value &&
        dispatchStateForm({
          type: "INPUT_LIST_ADD",
          inputValue: value,
          inputName: name,
          validate: validators[name],
        });
    },
    [validators]
  );

  const inputListRemoveHandler = useCallback((name, value) => {
    dispatchStateForm({
      type: "INPUT_LIST_REMOVE",
      inputValue: value,
      inputName: name,
    });
  }, []);

  const inputFocusHandler = useCallback((name) => {
    dispatchStateForm({
      type: "INPUT_FOCUS",
      inputName: name,
    });
  }, []);

  const inputBlurHandler = useCallback(
    (name) => {
      dispatchStateForm({
        type: "INPUT_BLUR",
        inputName: name,
        validate: validators[name],
      });
    },
    [validators]
  );

  const inputBackendErrorHandler = useCallback((name, error) => {
    dispatchStateForm({
      type: "INPUT_BACKEND_ERROR",
      inputName: name,
      error: error,
    });
  }, []);

  const validateForm = useCallback(() => {
    Object.keys(stateForm).map((key) => inputBlurHandler(key));
  }, [stateForm]);

  const checkFormIsValid = useCallback(() => {
    return !Object.values(stateForm).some((input) => !input.isValid);
  }, [stateForm]);

  const getFormData = useCallback(
    (cleanFunc) => {
      const data = {};
      Object.keys(stateForm).forEach((key) => {
        data[key] = stateForm[key].value;
      });
      return cleanFunc(data);
    },
    [stateForm]
  );

  const djangoBackendErrorsHandler = useCallback((e) => {
    const errorData = e?.data;
    if (errorData) {
      if (errorData?.non_field_errors) {
        setNonFieldBackendError(errorData.non_field_errors.toString());
        delete errorData.non_field_errors;
      }
      Object.keys(errorData).map((field) => {
        inputBackendErrorHandler(field, errorData[field]);
      });
    }
  }, []);

  const submitDataHandler = useCallback(
    async (func, key, prev, to, cleanFunc) => {
      setNonFieldBackendError("");
      // TODO problem with validation before submitting
      validateForm();
      if (!checkFormIsValid()) {
        return;
      }

      const data = getFormData(cleanFunc);
      try {
        await func({
          data,
          [key]: prev?.[key],
        });
        await navigate("/area-personale/", { state: { to: to } });
      } catch (e) {
        //for django-rest-framework
        djangoBackendErrorsHandler(e);
      }
    },
    [validateForm]
  );

  const backHandler = useCallback(() => {
    navigate(-1);
  }, []);

  return {
    stateForm,
    inputChangeHandler,
    inputFocusHandler,
    inputBlurHandler,
    inputBackendErrorHandler,
    inputListAddHandler,
    inputListRemoveHandler,
    checkFormIsValid,
    getFormData,
    djangoBackendErrorsHandler,
    submitDataHandler,
    backHandler,
    nonFieldBackendError,
  };
};

export default useForm;
