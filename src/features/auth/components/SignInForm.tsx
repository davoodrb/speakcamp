import { useForm } from "@tanstack/react-form-start";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useSignIn } from "../hooks/use-auth";

const loginFormSchema = z.object({
	identifier: z.string(),
	password: z.string().min(1, "Password is required"),
});

function SignInForm() {
	const signIn = useSignIn();

	const form = useForm({
		defaultValues: {
			identifier: "",
			password: "",
		},
		validators: {
			onSubmit: loginFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const isEmail = z
					.string()
					.pipe(z.email())
					.safeParse(value.identifier).success;

				const res = await signIn.mutateAsync({
					[isEmail ? "email" : "username"]: value.identifier,
					password: value.password,
				});

				if (!res) {
					throw new Error();
				}

				toast.success(`Welcome back ${res.data.user.username}`);
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
				<h1 className="text-lg font-bold">Rootalk 🗣️</h1>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<FieldGroup>
					<form.Field name="identifier">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel htmlFor={field.name}>Username/Email *</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
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
									<FieldLabel htmlFor={field.name}>Password *</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										aria-invalid={isInvalid}
										type="password"
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
				</FieldGroup>
				<Button className="w-full" type="submit">
					Login
				</Button>
			</form>
			<div className="text-sm">
				<span>New to Rootalk?</span>
				<Button variant="link">
					<Link to="/auth/sign-up">create account</Link>
				</Button>
			</div>
		</div>
	);
}

export default SignInForm;
