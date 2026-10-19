import { getMessages } from "next-intl/server";
import type en from "@/messages/en.json";

/**
 * The site's copy, read on the server and handed to client components as
 * plain strings, so next-intl never ships to the browser.
 */
export type Messages = typeof en;

export async function loadMessages(): Promise<Messages> {
  return (await getMessages()) as unknown as Messages;
}
