"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { estimateReadingTime, formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";
import Link from "next/link";

const PostCard = (post: Post) => {
	const { isLoaded, user } = useUser();

	return (
		<div className="flex justify-between gap-2 w-[45rem]">
			<div className="flex flex-col gap-2 w-8/12">
				{/* The Avatar of the user who created the post */}
				<div className="flex items-center gap-2">
					<Avatar className="h-6 w-6">
						<AvatarImage src={user?.imageUrl} />
						<AvatarFallback className="uppercase text-xs">
							{user?.firstName} {user?.lastName}
						</AvatarFallback>
					</Avatar>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Link href={`/users/${user?.id}`} className="text-sm">
									{user?.firstName} {user?.lastName}
								</Link>
							</TooltipTrigger>
							{/* <TooltipContent>
								<div>
									<h1>{user?.birthday}</h1>
								</div>
							</TooltipContent> */}
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Details about the post */}
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

			{/* Post image */}
			<div className="w-4/12 flex items-center h-36">
				<img className="rounded-md h-full w-full object-cover mt-2" src={post.image} alt="image" />
			</div>
		</div>
	);
};

export default PostCard;
