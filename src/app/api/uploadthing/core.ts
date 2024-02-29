import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { pinecone } from '@/lib/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import OpenAI from 'openai';

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
			console.log('FILE🤮🤢🤢', file);
			const createdFile = await db.file.create({
				data: {
					// ID IS auto-generated
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
				console.log('Creating Pinecone');
				// Init OpenAI
				const openai = new OpenAI({
					apiKey: process.env.OPENAI_API_KEY,
				});
				// Init Pinecone
				const pineconeIndex = pinecone.Index('firstsaas');

				// create embeddings
				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY,
				});
				const vectorArr = await embeddings.embedQuery('TEST');
				// console.log('VECTOR ARR 👀👀', vectorArr);
				// Store Embeddings in Pinecone
				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					pineconeIndex,
					namespace: createdFile.id,
				});

				// await pineconeIndex.namespace(file.key).upsert([
				// 	{
				// 		id: 'vec1',
				// 		values: vectorArr,
				// 	},
				// ]);
				// console.log('CreatedFile🧑‍💻🧑‍💻🧑‍💻:', createdFile);

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
