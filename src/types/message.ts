import { AppRouter } from '@/trpc';
import { inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;

type Message = RouterOutput['getFileMessages']['messages'];

type OmitText = Omit<Messages[number], 'text'>;

type EmbeddedText = {
	text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & EmbeddedText;
