"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TextEditorProps {
	content: string;
	handleChange: (content: string) => void;
}
const TextEditor: React.FC<TextEditorProps> = ({ content, handleChange }) => {
	const editorRef: any = useRef(null);

	return (
		<div>
			<Editor
				id="FIXED_ID"
				apiKey={process.env.NEXT_PUBLIC_EDITOR_API_KEY}
				onInit={(_evt, editor) => (editorRef.current = editor)}
				initialValue="<p>Share your thoughts.</p>"
				init={{
					height: 500,
					menubar: false,
					plugins: [
						"advlist",
						"autolink",
						"footnotes",
						"lists",
						"link",
						"image",
						"charmap",
						"preview",
						"anchor",
						"searchreplace",
						"visualblocks",
						"code",
						"fullscreen",
						"insertdatetime",
						"media",
						"table",
						"code",
						"help",
						"wordcount",
					],
					toolbar: "undo redo | blocks | " + "bold italic forecolor | alignleft aligncenter " + "alignjustify footnotes | bullist numlist outdent indent |  " + "removeformat | help",
					content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }",
				}}
				value={content}
				onEditorChange={handleChange}
			/>
		</div>
	);
};

export default TextEditor;
