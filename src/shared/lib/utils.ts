import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatEnumLabel(value: string): string {
	const words = value.toLowerCase().split("_");
	words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
	return words.join(" ");
}
