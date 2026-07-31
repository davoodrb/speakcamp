import { useForm } from "@tanstack/react-form-start";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createRoomAction } from "../lib/room.functions";
import {
	type CreateRoomFormValues,
	createRoomFormSchema,
	languageValues,
	levelValues,
} from "../schemas";

function CreateRoomForm() {
	const form = useForm({
		defaultValues: {
			desc: "",
			language: "" as CreateRoomFormValues["language"],
			level: "" as CreateRoomFormValues["level"],
		},
		validators: {
			onSubmit: createRoomFormSchema,
		},

		onSubmit: async ({ value }) => {
			const res = await createRoomAction({ data: value });

			if (res.success) {
				toast.success(res.message);
			} else {
				toast.error(res.message);
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
				<form.Field name="language">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Language *</FieldLabel>
								<Select onValueChange={(e) => field.handleChange(e)}>
									<SelectTrigger className="w-full max-w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Fruits</SelectLabel>
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
								<Select onValueChange={(e) => field.handleChange(e)}>
									<SelectTrigger className="w-full max-w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Fruits</SelectLabel>
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
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Random thoughts"
									autoComplete="off"
								/>

								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>
			<Button type="submit">Create Room</Button>
		</form>
	);
}

export default CreateRoomForm;
