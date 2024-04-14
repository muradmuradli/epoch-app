"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import axios from "axios";
import { Bookmark, Dot, Heart, MessageCircle } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import {FaHeart, FaRegHeart} from 'react-icons/fa';

interface CommentSectionProps {
	post: any;
	user: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post, user }) => {
	return (
		<div className="flex flex-col gap-7">
			<h1 className="text-2xl">Comments ({post?.comments?.length})</h1>
			{/* Comment Input */}
			<div className="flex gap-2">
				<Avatar className="cursor-pointer">
					<AvatarImage src={user?.imageUrl} />
					<AvatarFallback className="uppercase">
						{user?.firstName} {user?.lastName}
					</AvatarFallback>
				</Avatar>
				<textarea className="w-full p-2 border border-slate-300 rounded-md" rows={3} placeholder="Add to the discussion"></textarea>
			</div>
			{/* Display Comments */}
			<div id="comments" className="mt-8 flex flex-col gap-5">
				{post?.comments?.map((comment: any) => (
					<div key={comment.id} className="flex gap-2">
						<Avatar className="cursor-pointer">
							<AvatarImage src={comment?.user?.imageUrl} />
							<AvatarFallback className="uppercase">{user?.firstName} {user?.lastName}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-2 w-full">
							<div className="p-3 border border-slate-200 rounded-md">
								<div className="flex items-center gap-1">
									<h1 className="font-semibold">{comment?.user?.firstName} {comment?.user?.lastName}</h1>
									<Dot />
									<span className="text-sm text-slate-500">{formatDate(comment?.createdAt)}</span>
								</div>
								<span>{comment?.content}</span>
							</div>
							<div className="flex gap-7">
								<div className="flex items-center gap-2">
									<button><Heart /></button>
									<span>{comment?.likes?.length}</span>
								</div>
								<div className="flex items-center gap-2">
									<button><MessageCircle /></button>
									<span>23</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const SinglePost = ({ params }: { params: { postId: string } }) => {
	const { userId } = useAuth();
	const [post, setPost] = useState<any>();
	const [user, setUser] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		fetchPost();
	}, []);

	const fetchPost = async () => {
		setIsLoading(true);
		try {
			// fetch the post
			const postResponse = await axios.get(`/api/posts/${params.postId}`);
			setPost(postResponse.data.post);

			// fetch the user associated with the post
			const userResponse = await axios.get(`/api/users/${postResponse.data.post.createdBy}`);
			setUser(userResponse.data.user);
		} catch (error) {
			console.error("Failed to fetch post:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const likePost = async () => {
		if (userId) {
			// Update UI immediately
			setPost((prevPost: any) => ({
				...prevPost,
				likes: prevPost.likes.includes(userId) ? prevPost.likes.filter((id: string) => id !== userId) : [...prevPost.likes, userId],
			}));

			try {
				// Make API request
				await axios.post(`/api/posts/${params.postId}`, {
					userId,
				});
			} catch (error) {
				// Handle error, and revert UI state if necessary
				console.error("Failed to like post:", error);
				setPost((prevPost: any) => ({
					...prevPost,
					likes: prevPost.likes.filter((id: string) => id !== userId),
				}));
			}
		}
	};

	useEffect(() => {
		fetchPost();
	}, []);

	if (isLoading) {
		return (
			<div className="w-full flex justify-center pt-10 h-screen">
				<MoonLoader />
			</div>
		);
	}

	return (
		<div className="flex gap-7 pt-2 mt-5">
			{/* Side Panel */}
			<div className="w-2/12 flex flex-col gap-4 items-end mt-10">
				{/* Like Button */}
				<div className="flex flex-col gap-1 items-center">
					<button onClick={likePost}>
						{post?.likes.includes(userId) ? <FaHeart size={24} className="text-red-500" />: <FaRegHeart size={24} />}
					</button>
					<span>{post?.likes?.length}</span>
				</div>

				{/* Comments Button */}
				<div className="flex flex-col gap-1 items-center">
					<a href="#comments"><MessageCircle /></a>
					<span>{post?.comments?.length}</span>
				</div>

				{/* Bookmark Button */}
				<button><Bookmark /></button>
			</div>

			{/* Main Content */}
			<div className="bg-white w-6/12 min-h-screen rounded-md overflow-hidden">
				{/* Background Image */}
				<div className="h-80">
					<img className="h-full object-cover w-full" src={post?.image} alt="background" />
				</div>

				{/* Post Details */}
				<div className="py-6 px-16 flex flex-col gap-8">
					{/* Author Info */}
					<div className="flex gap-3">
						<Avatar className="cursor-pointer">
							<AvatarImage src={user?.imageUrl} />
							<AvatarFallback className="uppercase">
								{user?.firstName} {user?.lastName}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<h1 className="font-extrabold">{user?.firstName} {user?.lastName}</h1>
							<span className="text-sm text-slate-400">Posted on {formatDate(post?.createdAt)}</span>
						</div>
					</div>

					{/* Post Title and Tags */}
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl text-center font-extrabold">{post?.title}</h1>
						<div className="flex items-center justify-center gap-6 text-zinc-400">
							{post?.tags?.map((tag: string, index: number) => (
								<span key={index}>#{tag}</span>
							))}
						</div>
					</div>

					{/* Post Content */}
					<div
						className="text-[17px] text-justify"
						style={{
							wordWrap: "break-word",
						}}
						dangerouslySetInnerHTML={{
							__html: post?.content!,
						}}
					/>

					{/* Comments Section */}
					<CommentSection post={post} user={user} />
				</div>
			</div>

			{/* Sidebar */}
			<div className="w-3/12 h-48 bg-white rounded-md overflow-hidden">
				<div className="bg-slate-200 w-full p-3 flex gap-2">
					<Avatar className="cursor-pointer">
						<AvatarImage src={user?.imageUrl} />
						<AvatarFallback className="uppercase">
							{user?.firstName} {user?.lastName}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold">
							{user?.firstName} {user?.lastName}
						</h1>
						<span className="text-sm">Joined: {formatDate(user?.createdAt)}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SinglePost;
