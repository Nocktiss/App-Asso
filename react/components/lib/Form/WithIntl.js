import React from "react";
import { useTranslation } from "react-i18next";

const WithIntl = ({ formatLabel, componentToRender: Component, ...rest }) => {
  const { t } = useTranslation("translations");

  if (rest.form && rest.form.errors && rest.form.errors[rest.field.name]) {
    rest.form.errors[rest.field.name] = t(rest.form.errors[rest.field.name]);
  }

  if (rest.label) {
    rest.label = formatLabel ? formatLabel(t(rest.label)) : t(rest.label);
  }

  if (rest.emptyLabel) {
    rest.emptyLabel = t(rest.emptyLabel);
  }

  if (rest.Label && rest.Label.label) {
    rest.Label.label = formatLabel
      ? formatLabel(t(rest.Label.label))
      : t(rest.Label.label);
  }

  return <Component {...rest} />;
};

export default WithIntl;
