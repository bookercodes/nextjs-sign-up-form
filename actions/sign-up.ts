// verify email
// I

"use server"

import db from "@/db"
import { hash } from "@node-rs/argon2"
import { eq } from "drizzle-orm"
import {
  SignUpActionState,
  signUpFormSchema,
  SignUpFormSchema
} from "@/definitions/sign-up"
import { usersTable, lower } from "@/db/schema"
import { redirect } from "next/navigation"

export async function signUp(
  _initialState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const form = Object.fromEntries(formData) as SignUpFormSchema

  const parsedForm = signUpFormSchema.safeParse(form)
  if (!parsedForm.success) {
    return {
      formData: form,
      fieldErrors: parsedForm.error.flatten().fieldErrors
    }
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(lower(usersTable.email), parsedForm.data.email))
  if (user) {
    return {
      formData: form,
      formError: "The email you entered has already been taken."
    }
  }

  const passwordHash = await hash(parsedForm.data.password)

  try {
    await db.insert(usersTable).values({
      email: parsedForm.data.email,
      passwordHash
    })
  } catch {
    return { formError: "An unexpected error occured. Please try again later." }
  }

  redirect("/")
}
