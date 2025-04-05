import { zodResolver } from "@hookform/resolvers/zod";
import { type ClientActionFunctionArgs, Form, useFetcher } from "react-router";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  data,
} from "react-router";
import {
  RemixFormProvider,
  getFormDataFromSearchParams,
  useRemixForm,
} from "remix-hook-form";
import { getFormData, getValidatedFormData } from "remix-hook-form/middleware";
import { z } from "zod";

const FormDataZodSchema = z.object({
  email: z.string().trim().nonempty("validation.required"),
  password: z.string().trim().nonempty("validation.required"),
  number: z.number({ coerce: true }).int().positive(),
  redirectTo: z.string().optional(),
  boolean: z.boolean().optional(),
  date: z.date().or(z.string()),
  null: z.null(),
});

const resolver = zodResolver(FormDataZodSchema);
type FormData = z.infer<typeof FormDataZodSchema>;

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const searchParamsFormData = await getFormData(context);
  return { result: "success" };
};
export const action = async ({ context }: ActionFunctionArgs) => {
  const { data, errors, receivedValues } = await getValidatedFormData<FormData>(
    context,
    resolver,
  );
  if (errors) {
    return { errors, receivedValues };
  }
  return { result: "success" };
};

export default function Index() {
  const fetcher = useFetcher();
  const methods = useRemixForm({
    resolver,
    fetcher,
    defaultValues: {
      redirectTo: undefined,
      number: 4,
      email: "test@test.com",
      password: "test",
      date: new Date(),
      boolean: true,
      null: null,
    },

    submitData: { test: "test" },
  });
  const { register, handleSubmit, formState, watch, setError } = methods;

  const checkbox = watch("boolean");
  return (
    <RemixFormProvider {...methods}>
      <p>Add a thing...</p>
      <Form method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
        <label>
          Boolean
          <input type="checkbox" {...register("boolean")} />
          {formState.errors.boolean?.message}
        </label>
        <label>
          number
          <input type="number" {...register("number")} />
        </label>

        <div>
          <button formMethod="post" type="submit" className="button">
            Add
          </button>
        </div>
      </Form>
    </RemixFormProvider>
  );
}
