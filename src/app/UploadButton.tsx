'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

const UploadButton = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v: any) => {
				if (!v) {
					setIsOpen(v);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button>Upload PDF</Button>
			</DialogTrigger>
			<DialogContent>Hello</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
