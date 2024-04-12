import prismadb from "@/lib/prismadb";
import PostCard from "./post";

const Posts = async () => {
	const posts = await prismadb.post.findMany();

	return (
		<div className="flex flex-col gap-10">
			{posts?.map((post) => {
				return <PostCard key={post.id} {...post} />;
			})}
		</div>
	);
};

export default Posts;
