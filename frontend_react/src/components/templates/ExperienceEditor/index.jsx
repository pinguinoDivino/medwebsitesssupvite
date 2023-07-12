import { removeDuplicatesFromObjectArray } from "_/common/utils";
import { addTagBadgeClass } from "_/common/tags";
import TitleRow from "_atoms/TitleRow";
import FormGroup from "_organisms/FormGroup";
import TextInput from "_atoms/TextInput";
import CounterInput from "_atoms/CounterInput";
import MultipleRadioInput from "_molecules/MultipleRadioInput";
import MultipleFilterSelectInput from "_molecules/MultipleFilterSelectInput";
import FileInput from "_atoms/FileInput";
import DragDropInput from "_molecules/DragDropInput";
import TextButton from "_atoms/TextButton";
import ModalCreation from "_molecules/ModalCreation";
import { postCityData, postTagData } from "_services/choices";
import SelectInput from "_atoms/SelectInput";

const ExperienceEditor = ({
  stateForm,
  inputChangeHandler,
  inputFocusHandler,
  inputBlurHandler,
  inputListAddHandler,
  inputListRemoveHandler,
  experienceType,
  isSfsErasmusLab,
  isCongress,
  isInternship,
  universities,
  cities,
  tags,
  tagGroups,
  countries,
  onBackClickHandler,
  onSubmitDataHandler,
  cityCreationValidators,
  tagCreationValidators,
  onNewTagHandler,
  onNewCityHandler,
  nonFieldBackendError,
}) => {
  const universityInputs = [
    {
      label: "Seleziona lo stato",
      options: removeDuplicatesFromObjectArray(
        universities.map((univ) => {
          return {
            value: univ.country,
            label: univ.country,
          };
        }),
        "value"
      ),
    },
    {
      label: "Seleziona l'università",
      options: universities.map((univ) => {
        return {
          country: univ.country,
          value: univ.id,
          label: univ.name,
        };
      }),
      searchField: "country",
    },
  ];

  const cityInputs = [
    {
      label: "Seleziona lo stato",
      options: removeDuplicatesFromObjectArray(
        cities.map((city) => {
          return {
            value: city.country,
            label: city.country,
          };
        }),
        "value"
      ),
    },
    {
      label: "Seleziona la regione",
      options: removeDuplicatesFromObjectArray(
        cities.map((city) => {
          return {
            country: city.country,
            value: city.region,
            label: city.region,
          };
        }),
        "value"
      ),
      searchField: "country",
    },
    {
      label: "Seleziona la città",
      options: removeDuplicatesFromObjectArray(
        cities.map((city) => {
          return {
            region: city.region,
            value: city.id,
            label: city.city,
          };
        }),
        "value"
      ),
      searchField: "region",
    },
  ];

  const cityInitialState = {
    country: {
      value: "",
      isValid: true,
      errorText: "",
    },
    region: {
      value: "",
      isValid: true,
      errorText: "",
    },
    city: {
      value: "",
      isValid: true,
      errorText: "",
    },
  };

  const cityCreationInputs = [
    {
      name: "country",
      className: "col-md-8",
      label: "Stato",
      children: <SelectInput />,
      config: {
        options: countries.map((country) => {
          return { label: country, value: country };
        }),
      },
    },
    {
      name: "region",
      className: "col-md-8",
      label: "Regione",
      config: { type: "text" },
    },
    {
      name: "city",
      className: "col-md-8",
      label: "Città",
      config: { type: "text" },
    },
  ];

  const tagInitialState = {
    group: {
      value: "",
      isValid: true,
      errorText: "",
    },
    name: {
      value: "",
      isValid: true,
      errorText: "",
    },
  };

  const tagCreationInputs = [
    {
      name: "group",
      className: "col-md-8",
      label: "Gruppo",
      children: <SelectInput />,
      config: {
        options: tagGroups.map((group) => {
          return { label: group[1], value: group[0] };
        }),
      },
    },
    {
      name: "name",
      className: "col-md-8",
      label: "Nome",
      config: { type: "text" },
    },
  ];

  const formGroups = [
    {
      textTitle: "Informazioni generali",
      formRows: [
        [
          {
            name: "description",
            label: "Breve titolo",
            state: stateForm.description,
            inputBlurHandler: inputBlurHandler.bind(this, "description"),
            inputChangeHandler: inputChangeHandler.bind(this, "description"),
            inputFocusHandler: inputFocusHandler.bind(this, "description"),
            className: "col-md-6",
            config: { type: "text" },
          },
        ],
        [
          ...(isSfsErasmusLab || isInternship
            ? [
                {
                  name: "institution",
                  label: "Istituto",
                  state: stateForm.institution,
                  inputBlurHandler: inputBlurHandler.bind(this, "institution"),
                  inputChangeHandler: inputChangeHandler.bind(
                    this,
                    "institution"
                  ),
                  inputFocusHandler: inputFocusHandler.bind(
                    this,
                    "institution"
                  ),
                  className: "col-md-6",
                  config: { type: "text" },
                },
              ]
            : []),
          ...(isSfsErasmusLab
            ? [
                {
                  name: "thesis",
                  label: "Si può scrivere la tesi?",
                  state: stateForm.thesis,
                  inputBlurHandler: inputBlurHandler.bind(this, "thesis"),
                  inputChangeHandler: inputChangeHandler.bind(this, "thesis"),
                  inputFocusHandler: inputFocusHandler.bind(this, "thesis"),
                  className: "col-md-6",
                  children: <MultipleRadioInput />,
                  config: {
                    inputs: [
                      { value: "true", label: "Si" },
                      { value: "false", label: "No" },
                      { value: "", label: "Non so" },
                    ],
                  },
                },
              ]
            : []),
          ...(isInternship
            ? [
                {
                  name: "ward",
                  label: "Reparto",
                  state: stateForm.ward,
                  inputBlurHandler: inputBlurHandler.bind(this, "ward"),
                  inputChangeHandler: inputChangeHandler.bind(this, "ward"),
                  inputFocusHandler: inputFocusHandler.bind(this, "ward"),
                  className: "col-md-6",
                  config: { type: "text" },
                },
              ]
            : []),
          ...(isCongress
            ? [
                {
                  name: "title",
                  label: "Titolo",
                  state: stateForm.title,
                  inputBlurHandler: inputBlurHandler.bind(this, "title"),
                  inputChangeHandler: inputChangeHandler.bind(this, "title"),
                  inputFocusHandler: inputFocusHandler.bind(this, "title"),
                  className: "col-12 col-md-5",
                  config: { type: "text" },
                },
                {
                  name: "link",
                  label: "Link programma",
                  state: stateForm.link,
                  inputBlurHandler: inputBlurHandler.bind(this, "link"),
                  inputChangeHandler: inputChangeHandler.bind(this, "link"),
                  inputFocusHandler: inputFocusHandler.bind(this, "link"),
                  className: "col-10 col-md-5",
                  config: { type: "text" },
                },
                {
                  name: "cost",
                  label: "Costo",
                  state: stateForm.cost,
                  inputBlurHandler: inputBlurHandler.bind(this, "cost"),
                  inputChangeHandler: inputChangeHandler.bind(this, "cost"),
                  inputFocusHandler: inputFocusHandler.bind(this, "cost"),
                  className: "col-2",
                  config: { type: "number" },
                },
              ]
            : []),
        ],
        isCongress
          ? [
              {
                name: "organization",
                label: "Organizzazione",
                state: stateForm.organization,
                inputBlurHandler: inputBlurHandler.bind(this, "organization"),
                inputChangeHandler: inputChangeHandler.bind(
                  this,
                  "organization"
                ),
                inputFocusHandler: inputFocusHandler.bind(this, "organization"),
                className: "col-md-6",
                config: { type: "text" },
              },
              {
                name: "link_organization",
                label: "Link organizzazione",
                state: stateForm.link_organization,
                inputBlurHandler: inputBlurHandler.bind(
                  this,
                  "link_organization"
                ),
                inputChangeHandler: inputChangeHandler.bind(
                  this,
                  "link_organization"
                ),
                inputFocusHandler: inputFocusHandler.bind(
                  this,
                  "link_organization"
                ),
                className: "col-md-6",
                config: { type: "text" },
              },
            ]
          : [],
      ],
    },
    {
      textTitle: "Descrizione",
      formRows: [
        [
          {
            name: "author_contact",
            label: "Contatto personale",
            state: stateForm.author_contact,
            inputBlurHandler: inputBlurHandler.bind(this, "author_contact"),
            inputChangeHandler: inputChangeHandler.bind(this, "author_contact"),
            inputFocusHandler: inputFocusHandler.bind(this, "author_contact"),
            className: "col-lg-4 flex-colum-stretch-child",
            config: {
              type: "text",
              placeholder: "Lascia un contatto per essere contattato",
            },
          },
          {
            name: "started_at",
            label: "Data di inizio",
            state: stateForm.started_at,
            inputBlurHandler: inputBlurHandler.bind(this, "started_at"),
            inputChangeHandler: inputChangeHandler.bind(this, "started_at"),
            inputFocusHandler: inputFocusHandler.bind(this, "started_at"),
            className: "col-lg-4 flex-colum-stretch-child",
            config: {
              type: "date",
            },
          },
          {
            name: "ended_at",
            label: "Data di fine",
            state: stateForm.ended_at,
            inputBlurHandler: inputBlurHandler.bind(this, "ended_at"),
            inputChangeHandler: inputChangeHandler.bind(this, "ended_at"),
            inputFocusHandler: inputFocusHandler.bind(this, "ended_at"),
            className: "col-lg-4 flex-colum-stretch-child",
            config: {
              type: "date",
            },
          },
        ],
        [
          {
            name: "ref",
            label: "Referente",
            state: stateForm.ref,
            inputBlurHandler: inputBlurHandler.bind(this, "ref"),
            inputChangeHandler: inputChangeHandler.bind(this, "ref"),
            inputFocusHandler: inputFocusHandler.bind(this, "ref"),
            className: "col-lg-5",
            config: {
              type: "text",
              placeholder: "Con chi ti sei interfacciato nell'organizzazione?",
            },
          },
        ],
      ],
    },
    {
      textTitle: "Recensione",
      formRows: [
        [
          {
            name: "reviewA",
            label: "Racconta brevemente",
            state: stateForm.reviewA,
            inputBlurHandler: inputBlurHandler.bind(this, "reviewA"),
            inputChangeHandler: inputChangeHandler.bind(this, "reviewA"),
            inputFocusHandler: inputFocusHandler.bind(this, "reviewA"),
            className: "col-lg-6",
            children: <TextInput />,
            config: {
              rows: 10,
              placeholder:
                "Cosa hai fatto? Racconta le attività che hai svolto",
              max: 3000,
            },
          },
          {
            name: "reviewB",
            label: "Rapporto con i ricercatori",
            state: stateForm.reviewB,
            inputBlurHandler: inputBlurHandler.bind(this, "reviewB"),
            inputChangeHandler: inputChangeHandler.bind(this, "reviewB"),
            inputFocusHandler: inputFocusHandler.bind(this, "reviewB"),
            className: "col-lg-6",
            children: <TextInput />,
            config: {
              rows: 10,
              placeholder:
                "Come ti sei trovato con i professori e i ricercatori?",
              max: 3000,
            },
          },
          {
            name: "reviewC",
            label: "A chi consigli l'esperienza?",
            state: stateForm.reviewC,
            inputBlurHandler: inputBlurHandler.bind(this, "reviewC"),
            inputChangeHandler: inputChangeHandler.bind(this, "reviewC"),
            inputFocusHandler: inputFocusHandler.bind(this, "reviewC"),
            className: "col-lg-6",
            children: <TextInput />,
            config: {
              rows: 10,
              placeholder:
                "Secondo te chi dovrebbe replicare la tua esperienza e perché?",
              max: 3000,
            },
          },
          {
            name: "indications",
            label: "Qualche dritta per ottenere il massimo",
            state: stateForm.indications,
            inputBlurHandler: inputBlurHandler.bind(this, "indications"),
            inputChangeHandler: inputChangeHandler.bind(this, "indications"),
            inputFocusHandler: inputFocusHandler.bind(this, "indications"),
            className: "col-lg-6",
            children: <TextInput />,
            config: {
              rows: 10,
              placeholder:
                "Qualunque consiglio o suggerimento ti venga in mente",
              max: 3000,
            },
          },
        ],
      ],
    },
    {
      title: (
        <>
          <h2>Valutazioni</h2>
          <h3>(compresa fra 1 e 10)</h3>
        </>
      ),
      formRows: [
        [
          {
            name: "global_r",
            label: "Globale",
            state: stateForm.global_r,
            inputBlurHandler: inputBlurHandler.bind(this, "global_r"),
            inputChangeHandler: inputChangeHandler.bind(this, "global_r"),
            inputFocusHandler: inputFocusHandler.bind(this, "global_r"),
            className: "form-group-sm col-sm-6 col-xl-3",
            children: <CounterInput />,
            config: {
              config: { max: 10, min: 0 },
            },
          },
          {
            name: "stay_r",
            label: "Soggiorno",
            state: stateForm.stay_r,
            inputBlurHandler: inputBlurHandler.bind(this, "stay_r"),
            inputChangeHandler: inputChangeHandler.bind(this, "stay_r"),
            inputFocusHandler: inputFocusHandler.bind(this, "stay_r"),
            className: "form-group-sm col-sm-6 col-xl-3",
            children: <CounterInput />,
            config: {
              config: { max: 10, min: 0 },
            },
          },
          {
            name: "acquired_knowledge_r",
            label: "Conoscenza acquisita",
            state: stateForm.acquired_knowledge_r,
            inputBlurHandler: inputBlurHandler.bind(
              this,
              "acquired_knowledge_r"
            ),
            inputChangeHandler: inputChangeHandler.bind(
              this,
              "acquired_knowledge_r"
            ),
            inputFocusHandler: inputFocusHandler.bind(
              this,
              "acquired_knowledge_r"
            ),
            className: "form-group-sm col-sm-6 col-xl-3",
            children: <CounterInput />,
            config: {
              config: { max: 10, min: 0 },
            },
          },
          {
            name: "involvement_r",
            label: "Coinvolgimento",
            state: stateForm.involvement_r,
            inputBlurHandler: inputBlurHandler.bind(this, "involvement_r"),
            inputChangeHandler: inputChangeHandler.bind(this, "involvement_r"),
            inputFocusHandler: inputFocusHandler.bind(this, "involvement_r"),
            className: "form-group-sm col-sm-6 col-xl-3",
            children: <CounterInput />,
            config: {
              config: { max: 10, min: 0 },
            },
          },
        ],
      ],
    },
    {
      textTitle: "Luoghi",
      formRows: [
        [
          {
            name: "univ_ids",
            label: "",
            state: stateForm.univ_ids,
            inputBlurHandler: inputBlurHandler.bind(this, "univ_ids"),
            inputChangeHandler: inputListAddHandler.bind(this, "univ_ids"),
            inputFocusHandler: inputFocusHandler.bind(this, "univ_ids"),
            className: "col-12",
            children: <MultipleFilterSelectInput />,
            config: {
              multiple: true,
              textTitle: "Università",
              inputs: universityInputs,
              inputListRemoveHandler: inputListRemoveHandler.bind(
                this,
                "univ_ids"
              ),
              displaySelectedItemFn: (val) => {
                const item = universities.filter((item) => item.id === val)[0];
                return `${item.name} presso ${item.country}`;
              },
            },
          },
        ],
        [
          {
            name: "city_id",
            label: "",
            state: stateForm.city_id,
            inputBlurHandler: inputBlurHandler.bind(this, "city_id"),
            inputChangeHandler: inputChangeHandler.bind(this, "city_id"),
            inputFocusHandler: inputFocusHandler.bind(this, "city_id"),
            className: "col-10",
            children: <MultipleFilterSelectInput />,
            config: {
              multiple: false,
              textTitle: "Città",
              inputs: cityInputs,
              displaySelectedItemFn: (val) => {
                const item = cities.filter((item) => item.id === val)[0];
                return `${item.city} presso ${item.country}`;
              },
            },
          },
          {
            name: "city_creation_button",
            isNotInput: true,
            className: "col-2",
            children: (
              <ModalCreation
                title="Aggiungi una nuova città"
                buttonText="Aggiungi una città"
                mode="primary"
                initialState={cityInitialState}
                initialIsOpenState={false}
                validators={cityCreationValidators}
                inputs={cityCreationInputs}
                submitDataFunction={postCityData}
                onSubmit={onNewCityHandler}
              />
            ),
          },
        ],
        [
          {
            name: "img",
            label: "",
            state: stateForm.img,
            inputBlurHandler: inputBlurHandler.bind(this, "img"),
            inputChangeHandler: inputChangeHandler.bind(this, "img"),
            inputFocusHandler: inputFocusHandler.bind(this, "img"),
            className: "col-12",
            children: <FileInput />,
            config: {
              id: "img",
              textTitle: "Immagine",
              onRemove: inputChangeHandler.bind(this, "img", null),
              accept: "image/jpeg,image/png,image/gif",
            },
          },
        ],
      ],
    },
    {
      textTitle: "Tags",
      formRows: [
        [
          {
            name: "tags",
            label: "",
            state: stateForm.tags,
            inputBlurHandler: inputBlurHandler.bind(this, "tags"),
            inputChangeHandler: inputListAddHandler.bind(this, "tags"),
            inputFocusHandler: inputFocusHandler.bind(this, "tags"),
            className: "col-10",
            children: <DragDropInput />,
            config: {
              items: tags,
              fieldKey: "name",
              searchKey: "name",
              label: "tags",
              countKey: "using_count",
              onRemove: inputListRemoveHandler.bind(this, "tags"),
              badgeClassFn: (item) => addTagBadgeClass(item),
            },
          },
          {
            name: "tag_creation_button",
            isNotInput: true,
            className: "col-2",
            children: (
              <ModalCreation
                initialState={tagInitialState}
                validators={tagCreationValidators}
                inputs={tagCreationInputs}
                title="Aggiungi un nuovo Tag"
                submitDataFunction={postTagData}
                onSubmit={onNewTagHandler}
                buttonText="Aggiungi un tag"
                mode="primary"
                initialIsOpenState={false}
              />
            ),
          },
        ],
      ],
    },
  ];
  return (
    <div className="container-fluid">
      <TitleRow className="text-left" title={"Esperienza  " + experienceType} />
      <form encType="multipart/form-data">
        {formGroups.map((formGroup, index) => (
          <FormGroup key={index} {...formGroup} />
        ))}
        {nonFieldBackendError && (
          <div className="row form-row">
            <div className="col-12">
              <p className="not-found">{nonFieldBackendError}</p>
            </div>
          </div>
        )}
        <div className="row form-row">
          <div className="col-12">
            <TextButton
              mode="danger"
              type="button"
              className="mr-1"
              onClick={onBackClickHandler}
            >
              Indietro
            </TextButton>
            <TextButton
              mode="success"
              type="button"
              className="ml-1"
              onClick={onSubmitDataHandler}
            >
              Salva
            </TextButton>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ExperienceEditor;
