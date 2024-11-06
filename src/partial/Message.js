import { Alert } from "react-bootstrap";

export const Message = ({ type, content, deleteFlash }) => (
  <Alert variant={type} onClose={deleteFlash} dismissible>
    {content}
  </Alert>
);
