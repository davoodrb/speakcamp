import { useForm } from "@tanstack/react-form-start";
import { toast } from "sonner";
import { updateAccount } from "#/features/account/actions/update-account.functions";
import { Button } from "#/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";
import { Textarea } from "#/shared/components/ui/textarea";
import type { User } from "#/shared/types/user";

function EditAccountForm({ user }: { user: User }) {
  const { email, displayUsername, bio } = user;

  const form = useForm({
    defaultValues: {
      email,
      username: displayUsername,
      bio: bio ?? "",
    },
    onSubmit: async ({ value }) => {
      try {
        await updateAccount({ data: { bio: value.bio } });
        toast.success("Bio updated successfully");
        form.reset({
          email,
          username: displayUsername,
          bio: value.bio,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong!";
        toast.error(message);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="username"
          children={(field) => {
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
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                  disabled={true}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="email"
          children={(field) => {
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
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                  disabled={true}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="bio"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Tell us about yourself (max 500 characters)"
                  maxLength={500}
                  rows={4}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {field.state.value.length}/500
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
      <form.Subscribe
        selector={(state) => [state.isDirty, state.isSubmitting]}
        children={([isDirty, isSubmitting]) => (
          <Button
            type="submit"
            className="mt-4"
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        )}
      />
    </form>
  );
}

export default EditAccountForm;
