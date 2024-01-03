import { auth, findStudent } from "~/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  const student = await findStudent(session.user.email);

  return (
    <div>
      <h2>Profile:</h2>
      <pre>{JSON.stringify(student, null, 2)}</pre>
    </div>
  );
}
