'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from './ui/progress';
import { Cloud, File } from 'lucide-react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

const UploadDropZone = () => {
	const [isUploading, setIsUploading] = useState<boolean | null>(true);
	const [uploadProgress, setUploadProgress] = useState<number>(0);

	// determinate progress bar
	const startSimulatedProgress = () => {
		setUploadProgress(0);

		const interval = setInterval(() => {
			setUploadProgress((prevV) => {
				if (prevV >= 95) {
					clearInterval(interval);
					return prevV;
				}
				return prevV + 5;
			});
		}, 500);
		return interval;
	};
	return (
		<Dropzone
			multiple={false}
			onDrop={async (acceptedFile) => {
				setIsUploading(true);

				const progressInverval = startSimulatedProgress();
				// Handle File Uplaoding
				// await new Promise((resolve) => setTimeout(resolve, 15000));

				clearInterval(progressInverval);
				setUploadProgress(100);
			}}
		>
			{({ getRootProps, getInputProps, acceptedFiles }) => (
				<div
					{...getRootProps()}
					className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
				>
					<div className="flex items-center justify-center w-full h-full">
						<label
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
						>
							<div className="flex flex-col items-center pt-5 pb-6">
								<Cloud className="h-6 w-6 text-zinc-500 mb-2" />
								<p className="mb-2 text-sm text-zinc-700">
									<span className="font-semibold">Click to upload</span> or drag
									and drop!
								</p>
								<p className="text-xs text-zinc-500">pdf (up to 4MB)</p>
							</div>

							{acceptedFiles && acceptedFiles[0] ? (
								<div className="flex max-w-xs bg-white items-center rounded-md overflow-hidden outline-[1px]outline-zinc-200 divide-x">
									<div className="px-3 py-2 h-full grid place-items-center">
										<File className="w-4 h-4 text-blue-500" />
									</div>
									<div className="px-3 py-3 h-full text-sm truncate">
										{acceptedFiles[0].name}
									</div>
								</div>
							) : null}
							{isUploading ? (
								<div className="w-full mt-4 max-w-xs mx-auto">
									<Progress
										indicatorColor={
											uploadProgress === 100 ? 'bg-green-500' : ''
										}
										value={uploadProgress}
										className="h-1 w-full bg-zinc-200"
									/>
									{uploadProgress === 100 ? (
										<div className="flex gap-2 items-center justify-center text-sm text-zinc-700 text-center pt-2">
											<Loader className="h-3 w-3 animate-spin " />
											Redirecting...
										</div>
									) : null}
								</div>
							) : null}
							<input
								{...getInputProps}
								type="file"
								id="dropzone-file"
								className="hidden"
							/>
						</label>
					</div>
				</div>
			)}
		</Dropzone>
	);
};
const UploadButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Upload PDF</Button>
			</DialogTrigger>

			<DialogContent>
				<UploadDropZone />
			</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
