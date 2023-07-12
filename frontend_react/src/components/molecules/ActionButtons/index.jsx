import TextButton from "_atoms/TextButton";

const ActionButtons = ({ handlers, className }) => {
  return (
    <div className={className}>
      {handlers.map((handler) => (
        <TextButton
          key={handler.text}
          onClick={handler.onClick}
          mode={handler.mode}
          className={handler.className}
          type={handler.type ? handler.type : "button"}
        >
          {handler.text}
        </TextButton>
      ))}
    </div>
  );
};

export default ActionButtons;
