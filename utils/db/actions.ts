//@ts-nocheck
import { db } from "./dbConfig";
import { Users, Subscriptions, GeneratedContent } from "./schema";
import { eq, sql, and, desc, ne } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs";

export async function updateUserPoints(userId: string, points: number) {
  try {
    const [updatedUser] = await db
      .update(Users)
      .set({ points: sql`${Users.points} + ${points}` })
      .where(eq(Users.stripeCustomerId, userId))
      .returning()
      .execute();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user points:", error);
    return null;
  }
}

export async function getUserPoints(userId: string) {
  try {
    console.log("Fetching points for user:", userId);
    const users = await db
      .select({ points: Users.points, id: Users.id, email: Users.email })
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .execute();
    console.log("Fetched users:", users);
    if (users.length === 0) {
      console.log("No user found with stripeCustomerId:", userId);
      return 0;
    }
    return users[0].points || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
}

export async function createOrUpdateSubscription(
  userId: string,
  stripeSubscriptionId: string,
  plan: string,
  status: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) {
  try {
    // First, get the user's ID from the Users table
    const [user] = await db
      .select({ id: Users.id })
      .from(Users)
      .where(eq(Users.stripeCustomerId, userId))
      .limit(1);

    if (!user) {
      console.error(`No user found with stripeCustomerId: ${userId}`);
      return null;
    }

    // Check if a subscription already exists
    const existingSubscription = await db
      .select()
      .from(Subscriptions)
      .where(eq(Subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1);

    let subscription;
    if (existingSubscription.length > 0) {
      // Update existing subscription
      [subscription] = await db
        .update(Subscriptions)
        .set({
          plan,
          status,
          currentPeriodStart,
          currentPeriodEnd,
        })
        .where(eq(Subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .returning()
        .execute();
    } else {
      // Create new subscription
      [subscription] = await db
        .insert(Subscriptions)
        .values({
          userId: user.id,
          stripeSubscriptionId,
          plan,
          status,
          currentPeriodStart,
          currentPeriodEnd,
        })
        .returning()
        .execute();
    }

    console.log("Subscription created or updated:", subscription);
    return subscription;
  } catch (error) {
    console.error("Error creating or updating subscription:", error);
    return null;
  }
}

export async function getActiveSubscription(userId: number) {
  try {
    const [subscription] = await db
      .select()
      .from(Subscriptions)
      .where(
        and(
          eq(Subscriptions.userId, userId),
          eq(Subscriptions.status, "active")
        )
      )
      .execute();
    return subscription;
  } catch (error) {
    console.error("Error fetching active subscription:", error);
    return null;
  }
}

export async function saveGeneratedContent(
  userId: string,
  content: string,
  prompt: string,
  contentType: string
) {
  try {
    const [savedContent] = await db
      .insert(GeneratedContent)
      .values({
        userId: sql`(SELECT id FROM ${Users} WHERE stripe_customer_id = ${userId})`,
        content,
        prompt,
        contentType,
      })
      .returning()
      .execute();
    return savedContent;
  } catch (error) {
    console.error("Error saving generated content:", error);
    return null;
  }
}

export async function getGeneratedContentHistory(
  userId: string,
  limit: number = 10
) {
  try {
    const history = await db
      .select({
        id: GeneratedContent.id,
        content: GeneratedContent.content,
        prompt: GeneratedContent.prompt,
        contentType: GeneratedContent.contentType,
        createdAt: GeneratedContent.createdAt,
      })
      .from(GeneratedContent)
      .where(
        eq(
          GeneratedContent.userId,
          sql`(SELECT id FROM ${Users} WHERE stripe_customer_id = ${userId})`
        )
      )
      .orderBy(desc(GeneratedContent.createdAt))
      .limit(limit)
      .execute();
    return history;
  } catch (error) {
    console.error("Error fetching generated content history:", error);
    return [];
  }
}

export async function updateUserStripeCustomerId(
  userId: number,
  stripeCustomerId: string
) {
  try {
    const [updatedUser] = await db
      .update(Users)
      .set({ stripeCustomerId })
      .where(eq(Users.id, userId))
      .returning()
      .execute();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user Stripe customer ID:", error);
    return null;
  }
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  try {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.stripeCustomerId, stripeCustomerId))
      .execute();
    return user;
  } catch (error) {
    console.error("Error fetching user by Stripe customer ID:", error);
    return null;
  }
}

export async function createOrUpdateUser(
  clerkUserId: string,
  email: string,
  name: string
) {
  try {
    console.log("Creating or updating user:", clerkUserId, email, name);
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.stripeCustomerId, clerkUserId))
      .execute();

    console.log("Existing user query result:", existingUser);

    if (existingUser.length > 0) {
      console.log("User exists, updating");
      const [updatedUser] = await db
        .update(Users)
        .set({
          name,
          email,
        })
        .where(eq(Users.stripeCustomerId, clerkUserId))
        .returning()
        .execute();
      console.log("Updated user:", updatedUser);
      return updatedUser;
    } else {
      console.log("User doesn't exist, inserting new user");
      const [newUser] = await db
        .insert(Users)
        .values({
          email,
          name,
          stripeCustomerId: clerkUserId,
          points: 50, // Award 50 points to new users
        })
        .returning()
        .execute();
      console.log("New user created:", newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return null;
  }
}