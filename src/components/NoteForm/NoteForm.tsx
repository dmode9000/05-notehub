// React
import { useId } from "react";

// Libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";

// Services
import { createNote } from "../../services/noteService";

// Types
import { noteTags, type Tag } from "../../types/note";

// Styles
import css from "./NoteForm.module.css";
import toast from "react-hot-toast";

interface NoteFormValues {
  title: string;
  content: string;
  tag: Tag;
}
const initialValues: NoteFormValues = { title: "", content: "", tag: "Todo" };

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Required")
    .min(3, "Title is too short(min 3)")
    .max(50, "Name is too long (max 50)"),
  content: Yup.string().max(500, "Content is too long (max 500)"),
  tag: Yup.string()
    .oneOf([...noteTags], "Invalid tag")
    .required("Required"),
});

interface NoteFormProps {
  closeFormModal: () => void;
}
export default function NoteForm({ closeFormModal }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created.");
      closeFormModal();
    },
    onError(Error) {
      console.error("Erorr creating note:", Error);
    },
  });

  const handleSubmit = (values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
    console.log("NoteForm data:", values);
    mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={css.form}>
        <fieldset className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field className={css.input} type="text" name="title" id={`${fieldId}-title`} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </fieldset>

        <fieldset className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Сontent</label>
          <Field
            as="textarea"
            className={css.textarea}
            name="content"
            id={`${fieldId}-content`}
            rows={8}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </fieldset>

        <fieldset className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field as="select" className={css.select} name="tag" id={`${fieldId}-tag`}>
            {noteTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </fieldset>
        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={closeFormModal}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            {isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
