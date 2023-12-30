import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function LoginPage() {
  async function getAccess(formData: FormData) {
    "use server";
    const tran_id = formData.get("tran_id");
    if (!tran_id) return;

    await signIn("access_code", {
      tran_id,
      redirect: true,
      callbackUrl: "/calc",
    });
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <section className="p-4 rounded-md border border-border min-w-96">
        <form method="post" action={getAccess}>
          <div>
            <Label>Transaction ID</Label>
            <Input name="tran_id" required />
          </div>
          <div className="mt-2">
            <Button type="submit" className="w-full">
              Get Access
            </Button>
          </div>

          <div>
            Don't have an access code?{" "}
            <Link href="/register" className="underline text-destructive">
              Get one.
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
