import User from "../models/User.js";
import { Webhook } from "svix";
import config from "../configs/index.js";

const createWebhooks = async (req, res) => {
  try {
    // Create svix instance with clerk webhook secret
    const whook = new Webhook(config.clerk_webhook_secret_key);

    // Getting Headers
    const headers = {
      svix_id: req.headers["svix_id"],
      svix_timestamp: req.headers["svix_timestamp"],
      svix_signature: req.headers["svix_signature"],
    };

    // verify headers
    await whook.verify(JSON.stringify(req.body), headers);

    // Getting data from request body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_addresse,
      userName: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    // Switch case for different Events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    res.status(200).json({
      success: true,
      message: "Webhook Recieved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};
