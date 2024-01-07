import { EmailTemplate } from "@/app/api/send/Email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
	try {
		const { email, name } = await request.json();

		const { data, error } = await resend.emails.send({
			from: "Rythm <info@rythm.capital>",
			to: [email],
			subject: "Thanks For Reaching Out - Rythm",
			react: EmailTemplate({ firstName: name }),
		});

		if (error) {
			return Response.json({ error });
		}

		return Response.json({ data });
	} catch (error) {
		return Response.json({ error });
	}
}
