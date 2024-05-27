import { Post } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Hexagon } from "lucide-react";

interface SuggestionMenuProps {
	posts: Post[];
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuggestionMenu: React.FC<SuggestionMenuProps> = ({ posts, isOpen, setIsOpen }) => {
	const [mounted, setMounted] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleClickOutside = (e: MouseEvent) => {
		if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
			setIsOpen(false);
		}
	};

	// Ensure the dropdown menu is rendered only on the client-side
	if (!mounted) return null;

	return (
		<AnimatePresence>
			{isOpen && posts?.length > 0 && (
				<motion.div
					className="absolute top-10 flex flex-col rounded border border-slate-300 p-2 mt-2 bg-white w-[80%]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					ref={menuRef}
				>
					<div className="flex justify-between gap-1 items-center">
						<span className="text-xs text-slate-500 ">Suggested posts</span>
						<Hexagon size={15} />
					</div>
					<DropdownMenuSeparator />
					{posts?.map((post) => (
						<Link key={post.id} className="p-2 hover:bg-slate-50 text-sm" href={`/posts/${post.id}`}>
							{post.title}
						</Link>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SuggestionMenu;
