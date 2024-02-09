'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

const UploadButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Upload PDF</Button>
			</DialogTrigger>

			<DialogContent>asdasd</DialogContent>
		</Dialog>
	);
};

export default UploadButton;
