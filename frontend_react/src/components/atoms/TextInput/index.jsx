import React from "react";

const TextInput = ({
  onChange,
  value,
  onBlur,
  onFocus,
  className,
  rows,
  placeholder,
  max,
}) => {
  return (
    <>
      <textarea
        className={className}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        rows={rows}
        placeholder={placeholder}
      />
      {max && (
        <div>
          <p className="small-1">Hai rimasto {max - value.length} caratteri</p>
        </div>
      )}
    </>
  );
};

export default React.memo(TextInput);
