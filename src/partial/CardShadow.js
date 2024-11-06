import React from "react";
import { Card } from "react-bootstrap";

export const CardShadow = ({
  children,
  cardClass,
  styleCard,
  bodyClass,
  styleBody,
}) => {
  return (
    <Card className={`border-0 ${cardClass} `} style={styleCard}>
      <Card.Body className={`shadow rounded-2 ${bodyClass}`} style={styleBody}>
        {children}
      </Card.Body>
    </Card>
  );
};
