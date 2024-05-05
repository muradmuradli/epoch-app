"use client";

import InputTags from "@/components/tags";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadButton } from "@/components/uploadthing";
import { useAuth } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Send, TrainFrontTunnel } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface TooltipProps {
	show: boolean;
	position: string;
	title: string;
	content: string;
}

// Define a new functional component for the tooltips
const Tooltip = ({ show, position, title, content }: TooltipProps) => {
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className={`absolute ${position} ml-2 flex flex-col text-sm gap-1 shadow-md shadow-slate-300 border border-slate-200 rounded-md p-4 h-fit w-full`}
				>
					<div className="flex justify-center items-center gap-2">
						<TrainFrontTunnel size="20" className="text-blue-500" />
						<h1 className="text-xl font-semibold">{title}</h1>
					</div>
					<span className="font-light">{content}</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

const Write = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { userId } = useAuth();
	const router = useRouter();

	const [title, setTitle] = useState<string>("");
	const [topic, setTopic] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [image, setImage] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);
	const [suggestions, setSuggestions] = useState<string[]>([]);

	const [showTitleTooltip, setShowTitleTooltip] = useState(false);
	const [showContentTooltip, setShowContentTooltip] = useState(false);
	const [showDescTooltip, setShowDescTooltip] = useState(false);
	const [showTagsTooltip, setShowTagsTooltip] = useState(false);

	const onSubmit = async (e: any) => {
		e.preventDefault();
		if (!image) {
			toast.error("Please add a background image");
			return;
		}

		if (!title) {
			toast.error("Please add a title");
			return;
		}

		if (!description) {
			toast.error("Please add a short description");
			return;
		}

		if (!topic) {
			toast.error("Please choose a topic");
			return;
		}

		if (tags.length === 0) {
			toast.error("Please add at least 1 tag");
			return;
		}

		if (!content) {
			toast.error("Please add a body to your post");
			return;
		}

		try {
			setIsLoading(true);
			await axios.post("/api/posts", {
				id: userId,
				title,
				topic,
				content,
				description,
				tags,
				image,
			});

			toast.success("Post created successfully! Redirecting!...", {
				duration: 2000,
				style: {
					backgroundColor: "#1790ec",
					color: "white",
				},
			});

			setTimeout(() => {
				router.push("/");
			}, 1000);
		} catch (error) {
			toast.error("Something went wrong, please try again.", { duration: 2000 });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex mt-10 gap-2 ml-16 mr-6 pt-2">
			<div className="w-8/12 p-10 rounded-md bg-white shadow-md shadow-slate-300 border border-slate-200">
				<div className="flex flex-col gap-3 items-start">
					<input
						onFocus={() => setShowTitleTooltip(true)}
						onBlur={() => setShowTitleTooltip(false)}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="text-3xl font-extrabold focus:outline-none w-full bg-transparent"
						placeholder="New Post Title Here..."
					/>

					<div className="flex flex-col items-start gap-2 mt-2">
						<h1 className="">Upload a background image</h1>
						<div className="flex items-center gap-6">
							{image ? (
								<div className="relative mt-1">
									<img className="h-[10rem] w-full object-cover rounded-lg" src={image} alt="background" />
									<div onClick={() => setImage("")} className="h-8 w-8 flex items-center justify-center cursor-pointer bg-red-500 text-white hover:bg-red-600 rounded-full absolute -top-3 -right-3">
										X
									</div>
								</div>
							) : (
								<UploadButton
									endpoint="imageUploader"
									onClientUploadComplete={(res: any) => {
										console.log(res[0]);
										console.log('here i am');
										// Do something with the response
										setImage(res[0].url);
									}}
									onUploadError={(error: Error) => {
										// Do something with the error.
										alert(`ERROR! ${error.message}`);
									}}
								/>
							)}
						</div>
					</div>
					<input
						value={description}
						onFocus={() => setShowDescTooltip(true)}
						onBlur={() => setShowDescTooltip(false)}
						onChange={(e) => setDescription(e.target.value)}
						className="text-lg focus:outline-none w-full bg-transparent mb-2"
						placeholder="Write a short post description..."
					/>

					<Select value={topic} onValueChange={setTopic}>
						<SelectTrigger className="w-[300px]">
							<SelectValue placeholder="Pick a topic" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ancient">Ancient</SelectItem>
							<SelectItem value="medieval">Medieval</SelectItem>
							<SelectItem value="modern">Modern</SelectItem>
						</SelectContent>
					</Select>

					<InputTags tags={tags} suggestions={suggestions} setSuggestions={setSuggestions} setShowTagsTooltip={setShowTagsTooltip} setTags={setTags} />
				</div>
				<ReactQuill onFocus={() => setShowContentTooltip(true)} onBlur={() => setShowContentTooltip(false)} className="h-60 rounded-md" theme="snow" value={content} onChange={setContent} />
				<Button onClick={onSubmit} disabled={isLoading} className="bg-blue-700 disabled:opacity-60 text-white text-[16px] mt-14 flex gap-1 hover:bg-blue-800">
					<Send size={15} />
					<span>Publish</span>
				</Button>
			</div>
			<div className="w-4/12 relative">
				{/* Use the Tooltip component for each tooltip */}
				<Tooltip
					show={showTitleTooltip}
					position="top-0"
					title="Writing a Great Post Title"
					content="Think of your post title as a super short (but compelling!) description — like an overview of the actual post in one short sentence. Use keywords where appropriate to help ensure people can find your post by search."
				/>

				<Tooltip
					show={showDescTooltip}
					position={`${image ? "top-[18rem]" : "top-[12rem]"}`}
					title="Add a Short Description"
					content="Add a short description that captivates the minds of the reader. This way you can give the users browsing our posts a small glimpse into the content of your posts without revealing too much."
				/>

				<Tooltip
					show={showTagsTooltip}
					position={`${image ? "top-[24.5rem]" : "top-[18.5rem]"}`}
					title="Add Some Tags"
					content="You can add tags to your posts here. Write your tag, and then press enter to see your tags displayed."
				/>

				<Tooltip
					show={showContentTooltip}
					position={`${image ? "top-[28.5rem]" : "top-[22.5rem]"}`}
					title="Writing Great Content"
					content="Think of your blog post content as the detailed explanation and elaboration of your post title. Provide valuable information, insights, and context to your readers. Your content should be engaging and informative, keeping the reader's attention from start to finish."
				/>
			</div>
		</div>
	);
};

export default Write;
