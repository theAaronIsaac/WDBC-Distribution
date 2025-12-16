import { SignIn } from "@clerk/clerk-react";

export default function AdminLogin() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignIn path="/admin/login" routing="path" signUpUrl="/admin/sign-up" />
    </div>
  );
}
