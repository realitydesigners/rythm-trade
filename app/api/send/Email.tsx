import {
	Body,
	Head,
	Heading,
	Html,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
	firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	firstName,
}) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="mx-auto my-auto font-sans">
				<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
					Thanks For Reaching Out, <strong>{firstName}</strong>
				</Heading>
				<Text className="text-[16px] leading-[24px] text-black">
					We will get back to you with more information shortly.
				</Text>
			</Body>
		</Tailwind>
	</Html>
);
