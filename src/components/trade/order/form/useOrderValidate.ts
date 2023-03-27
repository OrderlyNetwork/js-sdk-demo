interface useOrderValidateReturn {
  validate: (values: any) => any;
}

export const useOrderValidate = (): useOrderValidateReturn => {
  const validate = (values): any => {
    const errors = {};

    console.log("values", values);

    return errors;
  };

  return { validate };
};
