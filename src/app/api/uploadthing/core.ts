import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const auth = (req: Request) => ({ id: 'fakeId' });

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.middleware(async ({ req }) => {
			const { getUser } = getKindeServerSession();

			const user = getUser();

			if (!user.id || !user) throw new Error('Unauthorized');

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;