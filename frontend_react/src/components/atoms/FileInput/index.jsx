import { useRef } from "react";
import { baseUrl } from "_/common/utils";
import { isLink } from "_/common/validators";
import styles from "./index.module.css";

const FileInput = ({
  onChange,
  onFocus,
  onBlur,
  onRemove,
  config,
  value,
  textTitle,
  accept,
}) => {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    onChange(fileUploaded);
  };

  const onDragHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const onDropHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.dataTransfer.files && evt.dataTransfer.files[0]) {
      onChange(evt.dataTransfer.files[0]);
    }
  };

  const onRemoveHandler = () => {
    onRemove();
  };
  const previewFile =
    value && isLink(value).inputIsNotValid ? URL.createObjectURL(value) : value;

  return (
    <>
      <h3>{textTitle}</h3>
      <div className="row form-row">
        <div className="col-6 col-sm-8 col-md-4">
          <div
            className={styles["drop-container"]}
            onDragOver={onDragHandler}
            onDrop={onDropHandler}
            onBlur={onBlur}
            onFocus={onFocus}
          >
            <span className={styles["drop-title"]}>Sposta file qui</span>o
            <button
              type="button"
              onClick={handleClick}
              className={styles.button}
            >
              <img
                className={styles.upload}
                alt=""
                src={baseUrl + "static/img/frontend/experiences/upload.png"}
              />
              Carica un file
            </button>
            <input
              onFocus={onFocus}
              onBlur={onBlur}
              type="file"
              accept={accept}
              ref={hiddenFileInput}
              onChange={handleChange}
              className={styles.file}
              {...config}
            />
          </div>
        </div>

        {value && (
          <div className="text-center col-6 col-sm-4 col-md-3 mt-1">
            <div className="pb-1">
              Hai caricato <i>{value.name}</i>
            </div>
            <img className={styles.preview} src={previewFile} alt="" />
            <div className={styles.remove + " bold"} onClick={onRemoveHandler}>
              Rimuovi
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default FileInput;
