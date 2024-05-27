"use client";

import prismadb from "@/lib/prismadb";
import PostCard from "./post";
import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { BookOpenCheck, ChevronsUpDown, FolderClosed, Notebook, X } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Posts = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [topics, setTopics] = useState<string[]>([
		"Ancient Civilizations",
		"Medieval History",
		"Renaissance",
		"Age of Exploration",
		"Revolutionary Wars",
		"Industrial Revolution",
		"World War I",
		"World War II",
		"Cold War",
		"Modern History",
		"History of Science",
		"History of Art",
		"History of Religion",
		"History of Technology",
		"Colonial History",
		"History of Asia",
		"History of Africa",
		"History of the Americas",
		"European History",
		"Middle Eastern History",
		"Military History",
		"Political History",
		"Economic History",
		"Social History",
		"Cultural History",
		"History of Medicine",
		"Women's History",
		"Environmental History",
		"History of Education",
		"History of Philosophy",
	]);
	const [showAllTopics, setShowAllTopics] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const displayedTopics = showAllTopics ? topics : topics.slice(0, 8);

	useEffect(() => {
		fetchPosts();
	}, []);

	const filterPostsByTopic = async (topic: string) => {
		setIsLoading(true);

		try {
			const { data } = await axios.get(`/api/posts?topic=${topic}`);
			setPosts(data.posts);
		} catch (error) {
			toast.error("Something went wrong, please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchPosts = async () => {
		setIsLoading(true);
		try {
			const { data } = await axios.get("/api/posts");
			setPosts(data.posts);
		} catch (error) {
			toast.error("Something went wrong, please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const generateColor = (index: number) => {
		const hue = (index * 137.508) % 360;
		return `hsl(${hue}, 70%, 73%)`;
	};

	return (
		<div className="flex justify-around">
			<div className="flex flex-col gap-10 w-7/12">
				{isLoading ? (
					<div className="flex flex-col items-center">
						<MoonLoader size={56} />
					</div>
				) : (
					<>
						{posts && posts.length > 0 ? (
							posts.map((post) => <PostCard key={post.id} {...post} />)
						) : (
							<div className="flex flex-col items-center">
								<img className="h-64" src="/not-found.png" />
								<span className="text-2xl text-slate-900 font-bold">No Posts Found...</span>
							</div>
						)}
					</>
				)}
			</div>

			<div className="w-5/12 ">
				<div className="flex items-center gap-1">
					<h1 className="text-lg font-semibold mb-2 text-slate-700">Popular Topics</h1>
					<Notebook className="mb-2" size={20} />
				</div>
				<div className="flex flex-wrap gap-2 h-fit">
					<AnimatePresence>
						{displayedTopics.map((topic, index) => (
							<motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
								<Badge className="h-8 cursor-pointer" onClick={() => filterPostsByTopic(topic)} style={{ backgroundColor: generateColor(index) }}>
									{topic}
								</Badge>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
				<div className="flex gap-2 items-center mt-4">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<IconButton className="rounded-full mt-2" onClick={() => setShowAllTopics(!showAllTopics)}>
									<ChevronsUpDown size={20} />
								</IconButton>
							</TooltipTrigger>
							<TooltipContent>
								<p>Show more topics</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<IconButton className="rounded-full mt-2" onClick={fetchPosts}>
									<X size={20} />
								</IconButton>
							</TooltipTrigger>
							<TooltipContent>
								<p>Remove the topic filter</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
};

export default Posts;
