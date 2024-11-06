const SpanStatus = ({ value, variant }) => {
  return (
    <span
      className={`bg-${variant || "warning"} bg-opacity-10 text-${
        variant || "warning"
      } py-1 px-2 rounded border border-${variant || "warning"}`}
      style={{ fontSize: "0.8rem" }}
    >
      {value}
    </span>
  );
};

export default SpanStatus;
