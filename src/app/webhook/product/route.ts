import { verifyWebhookSignature } from "@hygraph/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  // const body = await request.json();
  // const signature = request.headers.get("gcms-signature");
  // const isValid = verifyWebhookSignature({
  //   body,
  //   signature,
  //   secret: process.env.WEBHOOK_SECRET,
  // });

  // if (!isValid) {
  //   return new Response("Invalid signature", { status: 401 });
  // }

  revalidatePath("/calc", "page");
  revalidateTag("calculatorCount");
  return new Response("OK", { status: 200 });
}
