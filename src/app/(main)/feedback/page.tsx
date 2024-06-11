import { Metadata } from "next";

import feedback from "~/assets/seo/feedback.jpeg";

const title = "Feedback - Matrahin";
const description =
  "Send feedback about how we can improve matrahin. We are always looking for ways to improve our platform.";
const url = new URL("https://matrahin.com/feedback");

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    type: "website",
    description: description,
    images: [
      {
        url: feedback.src,
        alt: title,
      },
    ],
    title: title,
    url: url,
  },
  alternates: { canonical: url },
  metadataBase: url,
};

export default function FeedbackPage() {
  return (
    <div>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSej_C0mWa1JcbbVOMmscmFsKP5uTr0JlAq9ImHXV6RnVvg1sA/viewform?embedded=true"
        className="w-full h-[calc(100vh-4rem-1px)]"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
      >
        Loading…
      </iframe>
    </div>
  );
}
