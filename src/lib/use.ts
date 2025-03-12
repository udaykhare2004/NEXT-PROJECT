import { auth } from "@clerk/nextjs/server";

const {userId} = await auth()
export const currentUserId = userId