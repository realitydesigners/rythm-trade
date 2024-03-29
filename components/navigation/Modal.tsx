"use client";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useCallback, useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
	const overlay = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const onDismiss = useCallback(() => {
		router.back();
	}, [router]);

	const onClick: MouseEventHandler = useCallback(
		(e) => {
			if (e.target === overlay.current) {
				onDismiss();
			}
		},
		[onDismiss],
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onDismiss();
			}
		},
		[onDismiss],
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [onKeyDown]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			ref={overlay}
			className="fixed inset-0 z-10 mx-auto flex items-center justify-center bg-black/80"
			onClick={onClick}
		>
			<div className="relative  h-5/6 w-11/12 lg:h-[800px]">{children}</div>
		</div>
	);
}
