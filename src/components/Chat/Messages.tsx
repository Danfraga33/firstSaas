import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import React from 'react';

interface MessagesProps {
	fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
	const {} = trpc.getFileMessages.useInfiniteQuery(
		{
			fileId,
			limit: INFINITE_QUERY_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage?.nextCursor,
			keepPreviousData: true,
		}
	);
	return (
		<div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-thumb-track-blue scroll">
			Messagesasd
		</div>
	);
};

export default Messages;
