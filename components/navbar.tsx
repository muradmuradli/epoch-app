"use client";

import { Input } from "@/components/ui/input";
import { UserButton, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { LogIn, PencilIcon, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import SuggestionMenu from "./suggestion-menu";
import { Button } from "./ui/button";
import SavedPosts from "@/app/(pages)/posts/saved/page";

const Navbar = () => {
	const { isLoaded, userId, sessionId, getToken } = useAuth();

	const [inputText, setInputText] = useState<string>("");
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		if (inputText.trim() !== "") {
			getPosts();
			setIsOpen(true);
		} else {
			setSearchResults([]);
			setIsOpen(false);
		}
	}, [inputText]);

	const getPosts = async () => {
		try {
			const { data } = await axios.get("/api/posts", {
				params: { title: inputText.trim() },
			});
			setSearchResults(data.data);
		} catch (error) {
			console.error("Error fetching posts:", error);
			setSearchResults([]);
		}
	};

	return (
		<div className="p-5 border-b border-b-slate-300 flex justify-between">
			{/* Logo */}
			<Link href={"/"}>
				<img src={"/logo.png"} alt="logo" height={140} width={140} />
			</Link>

			{/* Search field */}
			<div className="flex w-[35rem] items-center gap-2 relative">
				<Input value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full border-slate-300" type="email" placeholder="What are you interested in?" />
				<Button type="submit" className="flex gap-2 bg-blue-600 hover:bg-blue-700">
					<Search size="20" />
					<span>Search</span>
				</Button>

				{/* Post suggestion menu that pops up when you type into the search-bar */}
				<SuggestionMenu posts={searchResults} isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>

			{/* Sign In Button / User Button */}
			<div className="flex items-center gap-5">
				<Link className="flex gap-2 text-slate-600 items-center hover:text-slate-900 transition py-0 px-2" href={"/write"}>
					<PencilIcon size={16} />
					<span>Write</span>
				</Link>

				{userId ? (
					<UserButton afterSignOutUrl="/">
						<UserButton.UserProfilePage label="Saved" url="custom" labelIcon={<FaBookmark className="ml-[1px]" />}>
							<SavedPosts />
						</UserButton.UserProfilePage>
					</UserButton>
				) : (
					<div>
						<Link href={"/sign-up"}>
							<Button className="flex gap-2">
								<LogIn size={"15"} />
								<span>Sign Up</span>
							</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
