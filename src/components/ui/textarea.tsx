import * as React from 'react';
// Since the textbar has a scroll, we use a lightweight package to enable textarea growing. We just swtich the props around first.
import TextareaAutoSize, {
	TextareaAutosizeProps,
} from 'react-textarea-autosize';

import { cn } from '@/lib/utils';

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					'flex  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = 'Textarea';

export { Textarea };
