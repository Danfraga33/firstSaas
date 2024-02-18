import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { pinecone } from '@/lib/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
const f = createUploadthing();

const auth = (req: Request) => ({ id: 'fakeId' });

export const ourFileRouter = {
	pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
		.middleware(async ({ req }) => {
			const { getUser } = getKindeServerSession();
			const user = getUser();

			if (!user.id || !user) throw new Error('Unauthorized');

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const createdFile = await db.file.create({
				data: {
					key: file.key,
					name: file.name,
					userId: metadata.userId,
					url: `https://utfs.io/f/${file.key}`,
					uploadStatus: 'PROCESSING',
				},
			});

			try {
				const response = await fetch(`https://utfs.io/f/${file.key}`);
				// PDF
				const blob = await response.blob();
				// WE load the PDF into the Langchain
				const loader = new PDFLoader(blob);

				const pageLevelDocs = await loader.load();

				const pagesAnt = pageLevelDocs.length;

				// Vectorize and index entire doc
				const pineconeIndex = pinecone.index('firstsaas');

				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY,
				});

				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					//@ts-ignore
					pineconeIndex,
					namespace: createdFile.id,
				});

				await db.file.update({
					data: {
						uploadStatus: 'SUCCESS',
					},
					where: {
						id: createdFile.id,
					},
				});
			} catch (err) {
				await db.file.update({
					data: {
						uploadStatus: 'FAILED',
					},
					where: {
						id: createdFile.id,
					},
				});
				console.error(err);
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
