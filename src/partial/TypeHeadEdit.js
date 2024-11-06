import { Typeahead } from "react-bootstrap-typeahead";
// Import as a module in your JS
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";

const TypeHeadEdit = ({
  id,
  size,
  labelKey,
  onChange,
  options,
  placeholder,
  selected,
  keySelected,
}) => {
  function getSelected(options, selected, keySelected) {
    if (options.length > 0 && selected) {
      return options.filter((opt) => opt[keySelected] === selected);
    }
    return [];
  }
  return (
    <Typeahead
      clearButton
      size="sm"
      id={id}
      labelKey={labelKey}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      selected={getSelected(options, selected, keySelected)}
    />
  );
};

export default TypeHeadEdit;
