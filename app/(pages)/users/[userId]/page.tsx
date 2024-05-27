"use client";

import { Button } from "@/components/ui/button";
import { estimateReadingTime, formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const UserDetails = ({ params }: { params: { userId: string } }) => {
	const { user, isLoaded } = useUser();
	const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		const { data } = await axios.get(`/api/posts/user-posts/${params?.userId}`);
		setPosts(data.posts);
	};

	if (!isLoaded) {
		return null;
	}

	return (
		<div className="flex items-start w-10/12 mx-auto py-10">
			<div className="w-9/12 flex flex-col gap-10">
				{posts?.map((post) => {
					return (
						<div key={post?.id}>
							<div className="flex justify-between gap-2 w-[45rem]">
								<div className="flex flex-col gap-2 w-8/12">
									<Link href={`/posts/${post.id}`}>
										<div className="flex flex-col">
											<h1 className="text-2xl font-semibold">{post.title}</h1>
											<h2>{post.description}</h2>
											<div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
												<span>{formatDate(post.createdAt)}</span>
												<span>{estimateReadingTime(post.content)} minute read</span>
												<span className="bg-zinc-200 px-3 py-1 rounded-full capitalize">{post.topic}</span>
											</div>
										</div>
									</Link>
								</div>
								<div className="w-4/12 flex items-center h-36">
									<img className="rounded-md h-full w-full object-cover mt-2" src={post.image} alt="image" />
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className="w-3/12 border border-slate-300 p-5 rounded-md">
				<img className="rounded-full h-20 w-20" src={user?.imageUrl} alt="user profile image" />
				<h1 className="mt-2 font-semibold text-slate-800">
					{user?.firstName} {user?.lastName}
				</h1>
				<span className="text-sm text-slate-600">Joined at: {formatDate(user?.createdAt)}</span>
				<Button className="flex gap-2 mt-2 bg-green-600 hover:bg-green-700">
					<span>Follow</span>
					<UserPlus />
				</Button>
			</div>
		</div>
	);
};

export default UserDetails;
