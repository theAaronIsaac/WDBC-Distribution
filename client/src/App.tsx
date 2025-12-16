import { Route, Switch } from "wouter";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Home from "./Home";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login">
        <SignedOut>
          <AdminLogin />
        </SignedOut>
        <SignedIn>
          <RedirectToSignIn />
        </SignedIn>
      </Route>
      <Route path="/admin">
        <SignedIn>
          <AdminDashboard />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Route>
    </Switch>
  );
}
