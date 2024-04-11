import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
	return (
		<div className="p-5 border-b border-b-slate-300 flex justify-between">
      {/* Logo */}
			<Link href={"/"}>
				<img src={"/logo.png"} alt="logo" height={140} width={140} />
			</Link>

      {/* Search field */}
			<div className="flex w-[35rem] items-center gap-2">
				<Input
					className="w-full border-slate-300"
					type="email"
					placeholder="What are you interested in?"
				/>
				<Button
					type="submit"
					className="flex gap-2 bg-blue-600 hover:bg-blue-700"
				>
					<Search size="20" />
					<span>Search</span>
				</Button>
			</div>
			<div></div>
		</div>
	);
};

export default Navbar;
