"use client";

import CommentSection from "@/components/comments";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { IconButton } from "@mui/material";
import axios from "axios";
import { Edit, MessageCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { MoonLoader } from "react-spinners";

const SinglePost = ({ params }: { params: { postId: string } }) => {
	const { userId } = useAuth();
	const [post, setPost] = useState<any>();
	const [user, setUser] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const router = useRouter();

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

			// Check if post is already saved by the user
			const savedResponse = await axios.get(`/api/posts/${params.postId}/save`);
			setIsSaved(savedResponse.data.saved);
		} catch (error) {
			console.error("Failed to fetch post:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const renderHTMLContent = (content: string) => {
		const parser = new DOMParser();
		const htmlDoc = parser.parseFromString(content, "text/html");

		const orderedLists = htmlDoc.querySelectorAll("ol");
		const lastOrderedList = orderedLists[orderedLists.length - 1];

		if (lastOrderedList) {
			const referencesHeading = htmlDoc.createElement("h1");
			referencesHeading.textContent = "References";
			referencesHeading.classList.add("text-3xl", "font-bold", "mt-6");
			lastOrderedList.parentNode?.insertBefore(referencesHeading, lastOrderedList);

			lastOrderedList.classList.add("pt-4", "text-base");

			const listItems = lastOrderedList.querySelectorAll("li");
			listItems.forEach((item, index) => {
				item.innerHTML = `${index + 1}. ${item.innerHTML}`;
			});
		}

		const modifiedContent = htmlDoc.documentElement.innerHTML.replace(/<ol>/g, '<ol style="list-style-type: decimal">');

		return modifiedContent;
	};

	const likePost = async () => {
		if (userId) {
			setPost((prevPost: any) => ({
				...prevPost,
				likes: prevPost.likes.includes(userId) ? prevPost.likes.filter((id: string) => id !== userId) : [...prevPost.likes, userId],
			}));

			try {
				await axios.post(`/api/posts/${params.postId}`, {
					userId,
				});
			} catch (error) {
				console.error("Failed to like post:", error);
				setPost((prevPost: any) => ({
					...prevPost,
					likes: prevPost.likes.filter((id: string) => id !== userId),
				}));
			}
		}
	};

	const toggleSavePost = () => {
		setIsSaved(!isSaved);
		if (!isSaved) {
			toast.success("Post saved successfully");
		} else {
			toast.success("Post removed from saved");
		}
		axios.post(`/api/posts/${params.postId}/save`).catch((error) => {
			console.error("Failed to toggle saved post:", error);
			toast.error("Failed to toggle saved post");
			// Revert the saved status if there's an error
			setIsSaved(isSaved);
		});
	};

	const onDelete = async (postId: string) => {
		try {
			setIsDeleting(true);
			await axios.delete(`/api/posts/${postId}`);

			router.refresh();
			setTimeout(() => {
				router.push("/");
			}, 1000);
			toast.success("Post deleted!");
		} catch (error) {
			toast.error("Failed to delete post.");
		} finally {
			setIsDeleting(false);
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
			{/* side panel */}
			<div className="w-2/12 flex flex-col gap-4 items-end mt-10">
				{/* like button */}
				<div className="flex flex-col items-center">
					<Button variant="ghost" className="px-2" onClick={likePost}>
						{post?.likes.includes(userId) ? <FaHeart size={24} className="text-red-500" /> : <FaRegHeart size={24} />}
					</Button>
					<span>{post?.likes?.length}</span>
				</div>

				{/* comments button */}
				<div className="flex flex-col gap-1 items-center px-2">
					<a href="#comments">
						<MessageCircle />
					</a>
					<span>{post?.comments?.length}</span>
				</div>

				{/* bookmark button */}
				<Button variant="ghost" className="px-2" onClick={toggleSavePost}>
					{isSaved ? <FaBookmark className="text-slate-900" size={23} /> : <FaRegBookmark size={23} />}
				</Button>
			</div>

			{/* main content */}
			<div className="bg-white w-6/12 min-h-screen rounded-md overflow-hidden">
				{/* background image */}
				<div className="h-80">
					<img className="h-full object-cover w-full" src={post?.image} alt="background" />
				</div>

				{/* post details */}
				<div className="py-6 px-16 flex flex-col gap-8">
					{/* author info */}
					<div className="flex gap-3 justify-between">
						<div className="flex gap-3">
							<Avatar className="cursor-pointer">
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback className="uppercase">
									{user?.firstName} {user?.lastName}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<h1 className="font-extrabold">
									{user?.firstName} {user?.lastName}
								</h1>
								<span className="text-sm text-slate-400">Posted on {formatDate(post?.createdAt)}</span>
							</div>
						</div>
						{userId === post?.createdBy && (
							<div className="flex items-center">
								<IconButton color="secondary" onClick={() => router.push(`/write?postId=${post?.id}`)}>
									<Edit />
								</IconButton>
								<ConfirmationModal
									triggerButton={
										<IconButton color="error">
											<MdDeleteOutline size={28} />
										</IconButton>
									}
									title="Sure you want to delete this post?"
									description="This cannot be undone!"
									onConfirm={() => onDelete(post?.id)}
									loading={isDeleting}
								/>
							</div>
						)}
					</div>

					{/* post title and tags */}
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl text-center font-extrabold">{post?.title}</h1>
						<div className="flex items-center justify-center gap-6 text-zinc-400">
							{post?.tags?.map((tag: string, index: number) => (
								<span key={index}>#{tag}</span>
							))}
						</div>
					</div>

					{/* post content */}
					<div
						className="text-[17px] text-justify"
						style={{
							wordWrap: "break-word",
						}}
						dangerouslySetInnerHTML={{
							__html: renderHTMLContent(post?.content!),
						}}
					/>

					{/* comment section */}
					<CommentSection post={post} user={user} />
				</div>
			</div>

			{/* sidebar */}
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
