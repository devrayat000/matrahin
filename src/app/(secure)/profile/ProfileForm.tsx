import { use } from "react";

import { Label } from "~/components/ui/label";
import LogOutButton from "~/components/common/LogoutButton";
import { Input } from "~/components/ui/input";
import { auth, findStudent } from "~/lib/auth";

export default function ProfileForm() {
  const session = use(auth());
  const student = use(findStudent(session.user.email));

  return (
    <div className="space-y-2">
      <section className="space-y-0.5">
        <Label id="name">Full Name</Label>
        <Input id="name" readOnly defaultValue={student.name} />
      </section>
      <section className="space-y-0.5">
        <Label id="email">Email</Label>
        <Input id="email" readOnly defaultValue={student.email} />
      </section>
      {student.phone && (
        <section className="space-y-0.5">
          <Label id="phone">Phone No.</Label>
          <Input id="phone" readOnly defaultValue={student.phone} />
        </section>
      )}
      {student.institution && (
        <section className="space-y-0.5">
          <Label id="institution">Institution</Label>
          <Input id="institution" readOnly defaultValue={student.institution} />
        </section>
      )}
      {student.hscYear && (
        <section className="space-y-0.5">
          <Label id="hscYear">Educational Status</Label>
          <Input id="hscYear" readOnly defaultValue={student.hscYear} />
        </section>
      )}
      <LogOutButton className="!mt-4 w-60">Log Out</LogOutButton>
    </div>
  );
}
