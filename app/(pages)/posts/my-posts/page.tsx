"use client";

import { estimateReadingTime, formatDate } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";

const MyPosts = () => {
	const [savedPosts, setSavedPosts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		fetchSaved();
	}, []);

	const fetchSaved = async () => {
		try {
			setIsLoading(true);
			const {
				data: { data },
			} = await axios.get("/api/posts/my-posts");
			setSavedPosts(data);
		} catch (error) {
			toast.error("Something went wrong.");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<MoonLoader size={40} />
			</div>
		);
	}

	return (
		<>
    <h1 className="text-slate-900">Your Created Posts</h1>
			{savedPosts?.map((post) => {
				return (
					<Link key={post.id} className="flex gap-2 my-4" href={`/posts/${post.id}`}>
						<div className="flex flex-col w-8/12">
							<h1 className="text-2xl font-semibold">{post.title}</h1>
							<h2>{post.description.substring(0, 40)}...</h2>
							<div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
								<span>{formatDate(post.createdAt)}</span>
								<span>{estimateReadingTime(post.content)} minute read</span>
								<span className="bg-zinc-200 px-3 rounded-full capitalize">{post.topic}</span>
							</div>
						</div>

						<div className="w-4/12 flex items-center h-24">
							<img className="rounded-md h-full w-full object-cover mt-2 border" src={post.image} alt="image" />
						</div>
					</Link>
				);
			})}
		</>
	);
};

export default MyPosts;
