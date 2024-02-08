// This is a cLient component of the trpc

import { AppRouter } from '@/trpc';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>({});
