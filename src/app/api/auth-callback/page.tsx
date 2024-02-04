import { trpc } from '@/app/_trcp/client';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

const Page = async () => {
	const router = useRouter();

	const searchParams = useSearchParams();
	const origin = searchParams.get('origin');

	trpc.authCallback.useQuery(undefined, {
		onSuccess: ({ success }) => {
			if (success) {
				// user is synced to db
				router.push(origin ? `/${origin}` : '/dashboard');
			}
		},
	});
	return <div>Page</div>;
};

export default Page;
