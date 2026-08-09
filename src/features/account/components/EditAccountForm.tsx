import { useForm } from "@tanstack/react-form-start";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";
import type { User } from "#/shared/types/user";

function EditAccountForm({ user }: { user: User }) {
	const { email, displayUsername } = user;

	const form = useForm({
		defaultValues: {
			email,
			username: displayUsername,
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
								<FieldLabel htmlFor={field.name}>username</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Login button not working on mobile"
									autoComplete="off"
									// TODO: remove later
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
								<FieldLabel htmlFor={field.name}>username</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Login button not working on mobile"
									autoComplete="off"
									// TODO: remove later
									disabled={true}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
			</FieldGroup>
		</form>
	);
}

export default EditAccountForm;
