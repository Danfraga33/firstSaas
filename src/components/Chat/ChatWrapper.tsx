'use client';
// Since we are using trpc, we need to make this a client component.

import Messages from './Messages';
import ChatInput from './ChatInput';
import { trpc } from '@/app/_trpc/client';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
interface ChatWrapperProps {
	fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
	const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
		{
			fileId,
		},
		{
			refetchInterval: (data) =>
				data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500,
		}
	);

	if (isLoading)
		return (
			<div className="relative min-h-full bg-zinc-200 flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="w-8 h-8 text-blue-800 animate-spin" />
						<h3 className="font-semibold text-xl">Processing PDF...</h3>
						<p className="text-zinc-500 text-sm">
							This won&apos;t take long...
						</p>
					</div>
				</div>

				<ChatInput isDisabled />
			</div>
		);

	if (data?.status === 'PROCESSING') {
		return (
			<div className="relative min-h-full bg-zinc-200 flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="w-8 h-8 text-blue-800 animate-spin" />
						<h3 className="font-semibold text-xl">Processing PDF...</h3>
						<p className="text-zinc-500 text-sm">
							This won&apos;t take long...
						</p>
					</div>
				</div>

				<ChatInput isDisabled />
			</div>
		);
	}

	if (data?.status === 'FAILED' ?? true) {
		return (
			<div className="relative min-h-full bg-zinc-200 flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<XCircle className="w-8 h-8 text-blue-800 " />
						<h3 className="font-semibold text-xl">Too many pages in PDF</h3>
						<p className="text-zinc-500 text-sm">
							Your <span className="font-medium"> Free </span> plan supports up
							to 5 pages per PDF.
						</p>
						<Link
							href="./dashboard"
							className={buttonVariants({
								variant: 'secondary',
								className: 'mt - 4',
							})}
						>
							<ChevronLeft />
						</Link>
					</div>
				</div>

				<ChatInput isDisabled />
			</div>
		);
	}
	return (
		<div className="relative bg-zinc-50 min-h-full divide-zinc-200 flex flex-col justify-between divide-y gap-2">
			<div className="flex-1 justify-between mb-28 flex flex-col">
				<Messages />
			</div>

			<ChatInput isDisabled />
		</div>
	);
};

export default ChatWrapper;
