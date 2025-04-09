import type { FieldValues, Resolver } from "react-hook-form";
import {
  // data as dataFn,
  type unstable_MiddlewareFunction,
  type unstable_RouterContextProvider,
  unstable_createContext,
} from "react-router";
import {
  getFormData as getFormDataUtility,
  validateFormData,
} from "../utilities";

const formDataContext = unstable_createContext<unknown>();

export function unstable_extractFormDataMiddleware({
  preserveStringified = false,
} = {}): unstable_MiddlewareFunction {
  return async function extractFormDataMiddleware({ request, context }, next) {
    const cloneRequest = request.clone();
    const { receivedValues: formData } = await getFormDataUtility(
      cloneRequest,
      preserveStringified,
    );

    context.set(formDataContext, formData);
    return next();

    /*  if (res instanceof Response && res.status === 422) {
      console.log("middleware response 422", res);

      return new Response(res.body, { status: 200 });
    } */
  };
}

export const getFormData = (context: unstable_RouterContextProvider) =>
  context.get(formDataContext);

export const getValidatedFormData = async <
  TFieldValues extends FieldValues,
  // biome-ignore lint/suspicious/noExplicitAny: defaults to any type
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  context: unstable_RouterContextProvider,
  resolver: Resolver<TFieldValues, TContext, TTransformedValues>,
) => {
  const formData = context.get(formDataContext);
  const data = await validateFormData<
    TFieldValues,
    TContext,
    TTransformedValues
  >(formData, resolver);
  /* if (errors) {
    throw dataFn(
      { errors, receivedValues: formData },
      {
        status: 422,
        headers: new Headers({ "X-Remix-Hook-Form-Validation-Error": "true" }),
      },
    );
  } */
  return { ...data, receivedValues: formData };
};
