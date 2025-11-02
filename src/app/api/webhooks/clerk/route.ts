import { addUser, deleteUserClerk } from "@/lib/actions";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const user_id = evt.data.id;
      const user_email = evt.data.email_addresses[0].email_address;
      let username;
      if (evt.data.username !== null) {
        username = evt.data.username;
      } else {
        username = user_email.split("@")[0];
      }

      const user_data = {
        id: user_id,
        name: username,
        email: user_email,
      };
      await addUser(user_data);
    }
    if (evt.type === "user.deleted") {
      const user_id = evt.data.id;
      if (user_id) await deleteUserClerk(user_id);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
