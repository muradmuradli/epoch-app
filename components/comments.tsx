"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import axios from "axios";
import { Dot, Heart, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaComment } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { ConfirmationModal } from "./confirmation-modal";
import { useRouter } from "next/navigation";

interface CommentSectionProps {
	post: any;
	user: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post, user }) => {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [comments, setComments] = useState(post?.comments || []);

	const createComment = async () => {
		try {
			setLoading(true);
			const { data } = await axios.post("/api/comments", { content, postId: post.id });
			const newComment = { ...data, user };
			setComments([newComment, ...comments]);
			setContent("");
			toast.success("Comment posted successfully!");
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (commentId: string) => {
		try {
			setLoading(true);
			await axios.delete(`/api/comments/${commentId}`);
			setComments(comments.filter((comment: any) => comment.id !== commentId));
			toast.success("Comment deleted!");
		} catch (error) {
			toast.error("Failed to delete comment.");
		} finally {
			setLoading(false);
		}
	};

	const likeComment = async (commentId: string) => {
		try {
			let updatedComments = comments.map((comment: any) => {
				if (comment.id === commentId) {
					const alreadyLiked = comment.likes.includes(user.id);
					if (alreadyLiked) {
						const updatedLikes = comment.likes.filter((userId: string) => userId !== user.id);
						return { ...comment, likes: updatedLikes };
					} else {
						return { ...comment, likes: [...comment.likes, user.id] };
					}
				}
				return comment;
			});

			setComments(updatedComments);
			await axios.post(`/api/comments/${commentId}/like`);
		} catch (error) {
			toast.error("Failed to like/unlike the comment.");
			setComments(comments);
		}
	};

	return (
		<div className="flex flex-col gap-7">
			<h1 className="text-2xl">Comments ({comments?.length})</h1>

			{/* comment input area */}
			<div className="flex gap-2">
				<Avatar className="cursor-pointer">
					<AvatarImage src={user?.imageUrl} />
					<AvatarFallback className="uppercase">
						{user?.firstName} {user?.lastName}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-2 w-full items-end">
					<textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" rows={3} placeholder="Add to the discussion"></textarea>
					{/* submit comment button */}
					<Button className="flex gap-2" type="submit" variant="default" disabled={loading} onClick={createComment}>
						<span>Submit</span>
						<FaComment />
					</Button>
				</div>
			</div>

			{/* display comments */}
			<div id="comments" className="flex flex-col gap-5">
				{comments?.map((comment: any) => (
					<div key={comment.id} className="flex gap-2">
						<Avatar className="cursor-pointer">
							<AvatarImage src={comment?.user?.imageUrl} />
							<AvatarFallback className="uppercase">
								{user?.firstName} {user?.lastName}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-2 w-full">
							<div className="p-3 border border-slate-200 rounded-md">
								<div className="flex items-center gap-1">
									<h1 className="font-semibold">
										{comment?.user?.firstName} {comment?.user?.lastName}
									</h1>
									<Dot />
									<span className="text-sm text-slate-500">{formatDate(comment?.createdAt)}</span>
								</div>
								<span>{comment?.content}</span>
							</div>
							<div className="flex gap-5 justify-start">
								<div className="flex gap-2 items-center">
									<Button
										className={`${comment?.likes.includes(user.id) ? "bg-red-500 hover:bg-red-600 text-white hover:text-white" : ""}`}
										onClick={() => likeComment(comment?.id)}
										type="button"
										variant="outline"
										size="icon"
									>
										<Heart size={15} />
									</Button>
									<span>{comment?.likes?.length}</span>
								</div>
								<ConfirmationModal
									triggerButton={
										<Button type="button" variant="outline" size="icon">
											<Trash2 size={15} />
										</Button>
									}
									title="Sure you want to delete this comment?"
									description="This cannot be undone!"
									onConfirm={() => onDelete(comment?.id)}
									loading={loading}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CommentSection;
