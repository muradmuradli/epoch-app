import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface ConfirmationModalProps {
	triggerButton: any;
	title: string;
	description: string;
  onConfirm: any;
  loading: boolean
}

export function ConfirmationModal({ triggerButton, title, description, loading, onConfirm }: ConfirmationModalProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button disabled={loading} variant="destructive" onClick={onConfirm}>
						Continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
