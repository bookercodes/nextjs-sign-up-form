"use client"

import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SignUpActionState,
  signUpFormSchema,
  SignUpFormData
} from "@/definitions/sign-up"
import { useActionState, useTransition } from "react"
import InputError from "./ui/input-error"
// import InputError from "./ui/input-error"

interface SignUpFormProps {
  action: (
    initialState: SignUpActionState,
    formData: FormData
  ) => Promise<SignUpActionState>
}

export default function SignUpForm({ action }: SignUpFormProps) {
  const [actionState, submitAction, isPending] = useActionState(action, {})
  const [, startTransition] = useTransition()

  console.log("actionState", actionState)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onTouched",
    defaultValues: actionState.formData
  })

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Welcome! Please fill in the details to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={submitAction}
          onSubmit={handleSubmit((_, e) => {
            startTransition(() => {
              const formData = new FormData(e?.target)
              submitAction(formData)
            })
          })}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className={errors.email ? "text-destructive" : ""}
            >
              Email
            </Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter your email"
              defaultValue={actionState.formData?.email}
              className={
                errors.email ? "border-destructive ring-destructive" : ""
              }
              aria-invalid={errors.email ? "true" : "false"}
            />
            <InputError error={errors.email?.message} />
            <InputError error={actionState.fieldErrors?.email} />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className={errors.password ? "text-destructive" : ""}
            >
              Password
            </Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter your password"
              defaultValue={actionState.formData?.password}
              className={
                errors.password ? "border-destructive ring-destructive" : ""
              }
              aria-invalid={errors.password ? "true" : "false"}
            />
            <InputError error={errors.password?.message} />
            <InputError error={actionState.fieldErrors?.password} />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          By joining, you agree to our{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
