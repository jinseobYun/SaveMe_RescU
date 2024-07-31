import { useEffect, useState } from "react";

function useForm({ initialValues, onSubmit, validate }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors(validate(values));
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
  };

  useEffect(() => {
    (async () => {
      if (isLoading) {
        if (errors === undefined || Object.keys(errors).length === 0) {
          await onSubmit(values);
        }
        setIsLoading(false);
      }
    })();
  }, [errors, isLoading]);

  return {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
}

export default useForm;
