import { useForm, useSelector } from "@tanstack/react-form-start";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Language, Level } from "#/generated/prisma/enums";
import { Button } from "#/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "#/shared/components/ui/select";
import { Spinner } from "#/shared/components/ui/spinner";
import { formatEnumLabel } from "#/shared/lib/utils";
import { createRoom } from "../actions/room.functions";
import { createRoomFormSchema } from "../schemas";

const languageValues = Object.values(Language);
const levelValues = Object.values(Level);

function CreateRoomForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      language: null as Language | null,
      level: null as Level | null,
      desc: "",
      maxParticipants: 6,
    },

    onSubmit: async ({ value }) => {
      try {
        const parsed = createRoomFormSchema.safeParse(value);

        if (!parsed.success) {
          return parsed.error;
        }

        const room = await createRoom({ data: parsed.data });

        toast.success(`Room successfully created`);
        router.navigate({ to: "/room/$id", params: { id: room.id } });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <FieldGroup>
        <form.Field name="language">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Language *</FieldLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {languageValues.map((language) => (
                        <SelectItem key={language} value={language}>
                          {formatEnumLabel(language)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="level">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Level *</FieldLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Levels</SelectLabel>
                      {levelValues.map((level) => (
                        <SelectItem key={level} value={level}>
                          {formatEnumLabel(level)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="maxParticipants">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Max Participants</FieldLabel>

                <Select
                  disabled={isSubmitting}
                  value={String(field.state.value)}
                  onValueChange={(value) => field.handleChange(Number(value))}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select max participants" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 6 }, (_, index) => {
                        const value = index + 1;

                        return (
                          <SelectItem key={value} value={String(value)}>
                            {value}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="desc">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Input
                  disabled={isSubmitting}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="random thoughts"
                  autoComplete="off"
                  maxLength={100}
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        Create Room
      </Button>
    </form>
  );
}

export default CreateRoomForm;
