import { useState, useCallback } from "react";

const useFormValidation = (schema, initialValues = {}) => {
    const [data, setData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback(
        (field, value) => {
            setData((prevData) => ({
                ...prevData,
                [field]: value,
            }));

            if (errors[field]) {
                clearFieldError(field);
            }
        },
        [errors],
    );

    const setValues = useCallback((newValues) => {
        setData((prevData) => ({
            ...prevData,
            ...newValues,
        }));
    }, []);

    const resetForm = useCallback(
        (newValues = initialValues) => {
            setData(newValues);
            setErrors({});
        },
        [initialValues],
    );

    const validate = useCallback(() => {
        if (!schema) return true;

        const { error } = schema.validate(data, { abortEarly: false });

        if (!error) {
            setErrors({});
            return true;
        }

        const newErrors = {};
        error.details.forEach((detail) => {
            newErrors[detail.path[0]] = detail.message;
        });

        console.log(newErrors);

        setErrors(newErrors);
        return false;
    }, [data, schema]);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const clearFieldError = useCallback((field) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const setFieldError = useCallback((field, message) => {
        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }));
    }, []);

    const startSubmitting = useCallback(() => {
        setIsSubmitting(true);
    }, []);

    const finishSubmitting = useCallback(() => {
        setIsSubmitting(false);
    }, []);

    return {
        data,
        errors,
        isSubmitting,
        handleChange,
        setValues,
        resetForm,
        validate,
        clearErrors,
        clearFieldError,
        setFieldError,
        startSubmitting,
        finishSubmitting,
    };
};

export default useFormValidation;
