import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";

export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      username: string;
    }) => {
      const { email, username, password } = data;

      const checkUsername = await authClient.isUsernameAvailable({
        username,
      });

      if (checkUsername.error) {
        throw new Error(checkUsername.error.message);
      }
      if (!checkUsername.data?.available) {
        throw new Error("Username is already taken");
      }

      const result = await authClient.signUp.email({
        email,
        password,
        displayUsername: username,
        username,
        name: "",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { ...result, email, username };
    },
    onSuccess: (_data) => {
      router.navigate({ to: "/" });
    },
  });
};

export const useSignIn = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      email?: string;
      username?: string;
      password: string;
    }) => {
      const { email, username, password } = data;

      if (!email && !username) {
        throw new Error("Email and username are both undefinded!");
      }

      if (email) {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        return result;
      }

      if (username) {
        const result = await authClient.signIn.username({
          username,
          password,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        return result;
      }
    },
    onSuccess: () => {
      router.navigate({ to: "/" });
    },
  });
};

export const useLogout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      router.navigate({ to: "/" });
      toast.success("Logged out successfully");
    },
  });
};
