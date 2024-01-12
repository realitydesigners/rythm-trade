import * as React from "react";
import {
	Body,
	Head,
	Html,
	Heading,
	Tailwind,
	Text,
} from "@react-email/components";

interface EmailTemplateProps {
	firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
	firstName,
}) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="my-auto mx-auto font-sans">
				<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
					Thanks For Reaching Out, <strong>{firstName}</strong>
				</Heading>
				<Text className="text-black text-[16px] leading-[24px]">
					We will get back to you with more information shortly.
				</Text>
			</Body>
		</Tailwind>
	</Html>
);
