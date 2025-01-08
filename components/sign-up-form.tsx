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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SignUpActionState,
  signUpFormSchema,
  SignUpFormSchema
} from "@/definitions/sign-up"
import { useActionState, useTransition } from "react"
// import InputError from "./ui/input-error"

interface SignUpFormProps {
  action: (
    initialState: SignUpActionState,
    formData: FormData
  ) => Promise<SignUpActionState>
}

export default function SignUpForm({ action }: SignUpFormProps) {
  const [actionState, formAction, isPending] = useActionState(action, {})
  const [, startTransition] = useTransition()

  console.log("actionState", actionState)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onTouched",
    // shouldUnregister: false,
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
        {actionState.formError && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{actionState.formError}</AlertDescription>
          </Alert>
        )}
        <form
          action={formAction}
          onSubmit={handleSubmit(async (_, e) => {
            startTransition(async () => {
              const formData = new FormData(e?.target)
              formAction(formData)
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
            {actionState.fieldErrors?.email && (
              <p className="text-sm font-medium text-destructive">
                {actionState.fieldErrors.email}
              </p>
            )}
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
            {/* <InputError message={errors.email?.message} />
            <InputError message={actionState.fieldErrors?.email} /> */}
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
            {actionState.fieldErrors?.password && (
              <p className="text-sm font-medium text-destructive">
                {actionState.fieldErrors.password[0]}
              </p>
            )}
            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
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
