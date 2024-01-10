import { Separator } from "~/components/ui/separator";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          A readonly profile created at the time of your subscription at ASG
          Shop.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
