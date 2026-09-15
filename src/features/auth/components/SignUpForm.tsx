import { useForm } from "@tanstack/react-form-start";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "#/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";
import { useSignUp } from "../hooks/use-auth";

const SignUpFormSchema = z.object({
  email: z.string().pipe(z.email("Invalid email address")),
  password: z.string().min(1, "Password is required"),
  username: z
    .string()
    .trim()
    .min(3, "Username should be at least 3 characters"),
});

function SignUpForm() {
  const signUp = useSignUp();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
    validators: {
      onSubmit: SignUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await signUp.mutateAsync({
          email: value.email,
          password: value.password,
          username: value.username,
        });

        toast.success(`Welcome ${res.data.user.username}`);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold">SpeakCamp 🗣️ | Create account</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <FieldGroup>
          <form.Field name="username">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="username"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="example@gmail.com"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                    placeholder="***"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
        <Button className="w-full" type="submit">
          Create account
        </Button>
      </form>
      <div className="text-sm">
        <span>Already have an account?</span>
        <Button variant="link">
          <Link to="/auth">sign in</Link>
        </Button>
      </div>
    </div>
  );
}

export default SignUpForm;
