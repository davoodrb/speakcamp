import { useForm } from "@tanstack/react-form-start";
import { toast } from "sonner";
import { updateAccount } from "#/features/account/actions/account.functions";
import { Button } from "#/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";
import { Textarea } from "#/shared/components/ui/textarea";
import { cn } from "#/shared/lib/utils";
import type { User } from "#/shared/types/user";

const BIO_MAX = 500;

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
                  aria-invalid={isInvalid}
                  autoComplete="username"
                  disabled
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
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  disabled
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const remaining = BIO_MAX - field.state.value.length;
            return (
              <Field data-invalid={isInvalid}>
                <div className="flex items-baseline justify-between">
                  <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                  <span
                    className={cn(
                      "text-xs tabular-nums text-muted-foreground/70",
                      remaining <= 20 && "text-destructive/80",
                    )}
                  >
                    {remaining}
                  </span>
                </div>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Tell us about yourself…"
                  maxLength={BIO_MAX}
                  rows={4}
                  className="resize-none"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(state) => ({
          isDirty: state.isDirty,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ isDirty, isSubmitting }) => (
          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default EditAccountForm;
