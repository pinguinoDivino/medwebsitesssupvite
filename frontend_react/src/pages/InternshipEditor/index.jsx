import { useLoaderData } from "react-router-dom";
import useForm from "_hooks/use-form";
import useAuth from "_hooks/use-auth";
import { isEmpty } from "_/common/validators";
import { getInternship, putInternship } from "_services/activities";
import {
  getInternshipWards,
  getInternshipYears,
  getInternshipPlaces,
  getInternshipAttendances,
} from "_services/choices";
import { getValueFromNestedArray } from "_/common/utils";
import InternshipEditor from "_templates/InternshipEditor";
import SelectInput from "_atoms/SelectInput";
import TextInput from "_atoms/TextInput";
import CounterInput from "_atoms/CounterInput";

const validators = {
  ward: isEmpty,
  academic_year: isEmpty,
  recommended_year: isEmpty,
  author_contact: isEmpty,
  review: isEmpty,
  rating: isEmpty,
  place: isEmpty,
  attendance: isEmpty,
};

const InternshipEditorPage = () => {
  const loaderData = useLoaderData();
  const { userEmail } = useAuth();
  const previousInternship = loaderData?.internship;

  const {
    stateForm,
    inputChangeHandler,
    inputBlurHandler,
    inputFocusHandler,
    backHandler,
    submitDataHandler,
    nonFieldBackendError,
  } = useForm(
    {
      ward: previousInternship
        ? getValueFromNestedArray(loaderData.wards, previousInternship.ward)
        : "",
      academic_year: previousInternship
        ? getValueFromNestedArray(
            loaderData.years,
            previousInternship.academic_year
          )
        : "",
      recommended_year: previousInternship
        ? getValueFromNestedArray(
            loaderData.years,
            previousInternship.recommended_year
          )
        : "",
      author_contact: previousInternship
        ? previousInternship.author_contact
        : userEmail,
      review: previousInternship ? previousInternship.review : "",
      rating: previousInternship ? previousInternship.rating : 0,
      place: previousInternship
        ? getValueFromNestedArray(loaderData.places, previousInternship.place)
        : "",
      attendance: previousInternship
        ? getValueFromNestedArray(
            loaderData.attendances,
            previousInternship.attendance
          )
        : "",
    },
    validators
  );

  const onSubmitDataHandler = async (e) => {
    e.preventDefault();
    await submitDataHandler(
      putInternship,
      "slug",
      previousInternship,
      "unipi-internships",
      (data) => data
    );
  };

  const formGroups = [
    {
      textTitle: "Informazioni generali",
      formRows: [
        [
          {
            name: "author_contact",
            label: "Contatto",
            state: stateForm.author_contact,
            inputBlurHandler: inputBlurHandler.bind(this, "author_contact"),
            inputChangeHandler: inputChangeHandler.bind(this, "author_contact"),
            inputFocusHandler: inputFocusHandler.bind(this, "author_contact"),
            className: "col-md-6 flex-colum-stretch-child",
            config: { type: "text" },
          },
          {
            name: "ward",
            label: "Reparto",
            state: stateForm.ward,
            inputBlurHandler: inputBlurHandler.bind(this, "ward"),
            inputChangeHandler: inputChangeHandler.bind(this, "ward"),
            inputFocusHandler: inputFocusHandler.bind(this, "ward"),
            children: <SelectInput />,
            className: "col-md-6",
            config: {
              options: loaderData.wards.map((ward) => {
                return {
                  value: ward[0],
                  label: ward[1],
                };
              }),
            },
          },
        ],
        [
          {
            name: "academic_year",
            label: "Anno svolto",
            state: stateForm.academic_year,
            inputBlurHandler: inputBlurHandler.bind(this, "academic_year"),
            inputChangeHandler: inputChangeHandler.bind(this, "academic_year"),
            inputFocusHandler: inputFocusHandler.bind(this, "academic_year"),
            children: <SelectInput />,
            className: "col-md-3 ",
            config: {
              options: loaderData.years.map((year) => {
                return {
                  value: year[0],
                  label: year[1],
                };
              }),
            },
          },
          {
            name: "recommended_year",
            label: "Anno consigliato",
            state: stateForm.recommended_year,
            inputBlurHandler: inputBlurHandler.bind(this, "recommended_year"),
            inputChangeHandler: inputChangeHandler.bind(
              this,
              "recommended_year"
            ),
            inputFocusHandler: inputFocusHandler.bind(this, "recommended_year"),
            children: <SelectInput />,
            className: "col-md-3",
            config: {
              options: loaderData.years.map((year) => {
                return {
                  value: year[0],
                  label: year[1],
                };
              }),
            },
          },
          {
            name: "place",
            label: "Luogo",
            state: stateForm.place,
            inputBlurHandler: inputBlurHandler.bind(this, "place"),
            inputChangeHandler: inputChangeHandler.bind(this, "place"),
            inputFocusHandler: inputFocusHandler.bind(this, "place"),
            children: <SelectInput />,
            className: "col-md-3",
            config: {
              options: loaderData.places.map((place) => {
                return {
                  value: place[0],
                  label: place[1],
                };
              }),
            },
          },
          {
            name: "attendance",
            label: "Presenza",
            state: stateForm.attendance,
            inputBlurHandler: inputBlurHandler.bind(this, "attendance"),
            inputChangeHandler: inputChangeHandler.bind(this, "attendance"),
            inputFocusHandler: inputFocusHandler.bind(this, "attendance"),
            children: <SelectInput />,
            className: "col-md-3",
            config: {
              options: loaderData.attendances.map((attendance) => {
                return {
                  value: attendance[0],
                  label: attendance[1],
                };
              }),
            },
          },
        ],
      ],
    },
    {
      textTitle: "Recensione e Valutazione",
      formRows: [
        [
          {
            name: "review",
            label: "Lascia un tuo parere",
            state: stateForm.review,
            inputBlurHandler: inputBlurHandler.bind(this, "review"),
            inputChangeHandler: inputChangeHandler.bind(this, "review"),
            inputFocusHandler: inputFocusHandler.bind(this, "review"),
            className: "col-md-8",
            children: <TextInput />,
            config: {
              max: 3000,
              rows: 10,
              placeholder:
                "Cosa hai fatto? Racconta le attività che hai svolto e come ti sei trovato.",
            },
          },
          {
            name: "rating",
            label: "Valutazione globale (0-10)",
            state: stateForm.rating,
            inputBlurHandler: inputBlurHandler.bind(this, "rating"),
            inputChangeHandler: inputChangeHandler.bind(this, "rating"),
            inputFocusHandler: inputFocusHandler.bind(this, "rating"),
            className: "col-md-4",
            children: <CounterInput />,
            config: { max: 10, min: 0 },
          },
        ],
      ],
    },
  ];

  return (
    <InternshipEditor
      formGroups={formGroups}
      backHandler={backHandler}
      submitDataHandler={onSubmitDataHandler}
      nonFieldBackendError={nonFieldBackendError}
    />
  );
};

export default InternshipEditorPage;

export const loader = async ({ params }) => {
  const wards = await getInternshipWards();
  const places = await getInternshipPlaces();
  const years = await getInternshipYears();
  const attendances = await getInternshipAttendances();

  if (params.slug) {
    const { data: internship } = await getInternship({ slug: params.slug });
    document.title = "Dettagli tirocinio presso " + internship.ward;
    return { internship, wards, places, years, attendances };
  }
  document.title = "Aggiungi tirocinio";
  return { wards, places, years, attendances };
};
