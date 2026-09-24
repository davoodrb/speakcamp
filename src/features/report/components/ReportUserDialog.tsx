import { useForm } from "@tanstack/react-form-start";
import { FlagIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ReportReason } from "#/generated/prisma/enums";
import { Button } from "#/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Textarea } from "#/shared/components/ui/textarea";
import { cn, formatEnumLabel } from "#/shared/lib/utils";
import { createReport } from "../actions/report.functions";
import {
  createReportFormSchema,
  REPORT_DETAILS_MAX,
  reportDetailsSchema,
  reportReasonSchema,
} from "../schemas";

const reasons = Object.values(ReportReason) as ReportReason[];

type ReportUserDialogProps = {
  userId: string;
  displayName: string;
};

function ReportUserDialog({ userId, displayName }: ReportUserDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      reason: ReportReason.HARASSMENT_OR_BULLYING as ReportReason,
      details: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const parsed = createReportFormSchema.safeParse({
          reportedUserId: userId,
          ...value,
        });

        if (!parsed.success) {
          return parsed.error;
        }

        await createReport({ data: parsed.data });

        toast.success("Report submitted");
        form.reset();
        setOpen(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong!";
        toast.error(message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive">
        <FlagIcon className="size-3.5" />
        Report user
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report @{displayName}</DialogTitle>
          <DialogDescription>
            Select a reason and describe what happened.
          </DialogDescription>
        </DialogHeader>

        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            details: state.values.details,
          })}
        >
          {({ isSubmitting, details }) => {
            const remaining = REPORT_DETAILS_MAX - details.length;
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                <FieldGroup>
                  <form.Field
                    name="reason"
                    validators={{
                      onChange: ({ value }) =>
                        reportReasonSchema.safeParse(value).success
                          ? undefined
                          : { message: "Select a reason" },
                    }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel>Reason *</FieldLabel>
                          <div className="flex flex-col gap-2">
                            {reasons.map((value) => (
                              <label
                                key={value}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-input px-3 py-2 text-sm transition-colors has-checked:border-ring has-checked:bg-muted/50"
                              >
                                <input
                                  type="radio"
                                  name={field.name}
                                  value={value}
                                  checked={field.state.value === value}
                                  onChange={() => field.handleChange(value)}
                                  onBlur={field.handleBlur}
                                  disabled={isSubmitting}
                                  className="size-4 shrink-0 accent-primary"
                                />
                                {formatEnumLabel(value)}
                              </label>
                            ))}
                          </div>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field
                    name="details"
                    validators={{
                      onChange: ({ value }) => {
                        const result = reportDetailsSchema.safeParse(value);
                        return result.success
                          ? undefined
                          : {
                              message:
                                result.error.issues[0]?.message ??
                                "Invalid details",
                            };
                      },
                    }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <div className="flex items-baseline justify-between">
                            <FieldLabel htmlFor={field.name}>
                              Details *
                            </FieldLabel>
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
                            disabled={isSubmitting}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Please describe what happened (required)"
                            maxLength={REPORT_DETAILS_MAX}
                            rows={3}
                            className="resize-none"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>

                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !details.trim()}
                    variant="destructive"
                  >
                    {isSubmitting ? "Submitting…" : "Submit report"}
                  </Button>
                </DialogFooter>
              </form>
            );
          }}
        </form.Subscribe>
      </DialogContent>
    </Dialog>
  );
}

export default ReportUserDialog;
