import { useForm, useSelector } from "@tanstack/react-form-start";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Spinner } from "#/components/ui/spinner";
import { Language, Level } from "#/generated/prisma/enums";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
		},

		onSubmit: async ({ value }) => {
			try {
				const parsed = createRoomFormSchema.safeParse(value);

				if (!parsed.success) {
					return parsed.error;
				}

				const res = await createRoom({ data: parsed.data });

				if (!res.success) {
					throw new Error(res.message);
				}

				toast.success(`Room successfully created`);
				router.navigate({ to: "/room/$id", params: { id: res.data.id } });
			} catch (error) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Something went wrong!");
				}
				return 0;
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
													{language}
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
													{level}
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
