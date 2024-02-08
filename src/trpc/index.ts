// This is the server side of the trpc. It injects props into the create trpc

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { router, publicProcedure, privateProcedure } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import { z } from 'zod';

export const appRouter = router({
	authCallback: publicProcedure.query(async () => {
		const { getUser } = getKindeServerSession();
		const user = await getUser();

		if (!user?.id || !user?.email)
			throw new TRPCError({ code: 'UNAUTHORIZED' });

		// check if the user is in the database
		const dbUser = await db.user.findFirst({
			where: {
				id: user.id,
			},
		});
		// If user does not exist in the DB, create user.
		if (!dbUser) {
			// create user in db
			await db.user.create({
				data: {
					id: user.id,
					email: user.email,
				},
			});
		}

		return { success: true };
	}),
	getUserFiles: privateProcedure.query(async ({ ctx }) => {
		// Destructuring the ctx object from trpc.ts
		const { userId, user } = ctx;

		return await db.file.findMany({
			where: {
				userId,
			},
		});
	}),
	// We use input instead of query as you input a file
	deleteFile: privateProcedure
		.input({ id: z.string() })
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx;
			const file = await db.file.findFirst({
				where: {
					id: input.id,
				},
			});
		}),
});

export type AppRouter = typeof appRouter;
