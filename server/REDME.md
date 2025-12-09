# Clerk Webhook কীভাবে কাজ

Clerk যখন আপনার অ্যাপে কোনো user তৈরি করে/আপডেট করে/ডিলিট করে—
Clerk সেই ইভেন্টগুলো আপনার সার্ভারের একটি URL-এ Webhook হিসেবে পাঠায়।

কিন্তু সমস্যা হলো—
Webhook আসলেই Clerk থেকে এসেছে কিনা, নাকি অন্য কেউ পাঠিয়েছে—
এটা যাচাই করা খুব গুরুত্বপূর্ণ।

এখানেই Svix ব্যবহার হয়।
Clerk তার Webhook গুলো Svix নামের সিকিউর সিগনেচার সিস্টেম দিয়ে সাইন করে পাঠায়।
আর আপনাকে শুধু সেই signature verify করতে হবে।

# Svix কী?

Svix হলো একটি Webhook Security System, যা:

- Webhook কে সাইন (sign) করে
- আপনি সার্ভারে signature verify করতে পারেন
- এতে নিশ্চিত হয় Webhook সত্যিই Clerk থেকে এসেছে
- Clerk পুরো webhook সিস্টেমটা Svix দিয়ে চালায়।

# Express.js Webhook Route

    import express from "express";
    import { Webhook } from "svix";

    const router = express.Router();

    // Clerk Dashboard থেকে Webhook Secret কপি করবেন
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    router.post("/clerk/webhook", express.raw({ type: "application/json" }), (req, res) => {
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).send("Missing webhook headers");
    }

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);

    let event;

    try {
        event = wh.verify(req.body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Webhook verify failed:", err);
        return res.status(400).send("Invalid signature");
    }

    // Event আসল Clerk ইভেন্ট (verified)
    console.log("Webhook event:", event.type);

    if (event.type === "user.created") {
        console.log("নতুন ব্যবহারকারী:", event.data);
    }

    if (event.type === "user.updated") {
        console.log("ব্যবহারকারী আপডেট:", event.data);
    }

    if (event.type === "user.deleted") {
        console.log("ব্যবহারকারী মুছে ফেলা হয়েছে:", event.data);
    }

    res.status(200).json({ ok: true });
    });

    export default router;

# কিভাবে এটা কাজ করে?

✔ Clerk ইভেন্ট পাঠায় → সার্ভার গ্রহণ করে
✔ Clerk ইভেন্টকে Svix signature দিয়ে সাইন করে
✔ Express raw body এনেছে (verify করার জন্য প্রয়োজন)
✔ Svix verify করে দেখে signature ঠিক আছে কিনা
✔ ঠিক থাকলে event handler চলে
✔ ভুল হলে “Invalid signature” দেখায়
