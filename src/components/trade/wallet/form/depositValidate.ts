export const useDepositValidate = (values: any) => {
  const validate = (values: any) => {
    const errors: any = {};
    if (!values.amount) {
      errors.amount = "Required";
    } else if (isNaN(Number(values.amount))) {
      errors.amount = "Must be a number";
    } else if (Number(values.amount) <= 0) {
      errors.amount = "Must be greater than zero";
    }
    return errors;
  };

  return {
    validate,
  };
};
