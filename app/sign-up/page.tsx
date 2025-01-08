import { signUp } from "@/actions/sign-up"
import SignUpForm from "@/components/sign-up-form"

export default function Page() {
  return (
    <div className="m-8">
      <SignUpForm action={signUp} />
    </div>
  )
}
