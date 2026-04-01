import db from "@/lib/db";
import type { NextAuthOptions as NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Twitter from "next-auth/providers/twitter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { equal } from "assert";

export const config = {
  // https://next-auth.js.org/configuration/providers/oauth
  //adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
    verifyRequest: "/signin",
    newUser: "/get-started",
  },
  theme: {
    colorScheme: "auto",
    logo: "/logo.svg",
    brandColor: "#2564eb",
    buttonText: "Continue with {provider}",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user) {
        if (account?.provider === "github") {
          const {
            login,
            name,
            email,
            bio,
            html_url: githubProfileURL,
            avatar_url,
            location,
            id: githubId,
          } = profile as any;
          if (!login) {
            return false; // Do not continue with the sign-in process
          }
          console.log("GitHub Profile:", profile);

          // Check if the user exists in your database based on their email
          const userExists = await db.user.findFirst({
            where: {
              OR: [{ email: email }, { githubId: githubId.toString() }],
            },
          });

          if (!userExists) {
            let username = login;
            let usernameExists = await db.user.findUnique({
              where: {
                username: username,
              },
            });
            if (usernameExists) {
              username = username + Math.floor(Math.random() * 10000);
            }
            // User doesn't exist, add them to the Users table
            try {
              const sessionUser = await db.user.create({
                data: {
                  username: username,
                  name: name,
                  email: email,
                  bio: bio,
                  location: location,
                  image: avatar_url,
                  githubId: githubId.toString(),
                },
                select: {
                  id: true,
                },
              });

              await db.userWebsite.create({
                data: {
                  userId: sessionUser.id,
                  value: githubProfileURL,
                },
              });

              const userSettingsExists = await db.userSettings.findFirst({
                where: {
                  userId: sessionUser.id,
                },
              });
              if (!userSettingsExists) {
                await db.userSettings.create({
                  data: {
                    userId: sessionUser.id,
                  },
                });
              }
            } catch (error) {
              console.error("Error inserting user into the database:", error);
              return false; // Do not continue with the sign-in process
            }
          } else {
            // User exists, update their details in the Users table
            try {
              // Update the user's details
              const user = await db.user.update({
                where: {
                  id: userExists.id,
                },
                data: {
                  githubId: githubId.toString(),
                  name: userExists.name ? userExists.name : name,
                  email: userExists.email ? userExists.email : email,
                },
              });

              const urlExists = await db.userWebsite.findFirst({
                where: {
                  userId: userExists.id,
                  value: githubProfileURL,
                },
              });

              if (!urlExists) {
                await db.userWebsite.create({
                  data: {
                    userId: userExists.id,
                    value: githubProfileURL,
                  },
                });
              }
            } catch (error) {
              console.error("Error updating user in the database:", error);
              return false; // Do not continue with the sign-in process
            }
          }
        } else if (account?.provider === "google") {
          console.log("Google Profile:", profile);
          const {
            sub: googleId,
            name,
            email,
            picture,
            email_verified,
            locale,
          } = profile as any;
          if (!googleId) {
            return false; // Do not continue with the sign-in process
          }

          // Check if the user exists in your database based on their email
          const userExists = await db.user.findFirst({
            where: {
              OR: [{ googleId: googleId }, { email: email }],
            },
          });

          if (!userExists) {
            // User doesn't exist, add them to the Users table
            //create username (login) form email if not exists in db else add number to username
            // remove =s96-c from image url
            const image = picture.replace("=s96-c", "");
            let username = email.split("@")[0];
            let usernameExists = await db.user.findUnique({
              where: {
                username: username,
              },
            });
            if (usernameExists) {
              username = username + Math.floor(Math.random() * 10000);
            }
            try {
              const sessionUser = await db.user.create({
                data: {
                  name: name,
                  email: email,
                  image: image,
                  googleId: googleId,
                  username: username,
                },
                select: {
                  id: true,
                },
              });

              const userSettingsExists = await db.userSettings.findFirst({
                where: {
                  userId: sessionUser.id,
                },
              });
              if (!userSettingsExists) {
                await db.userSettings.create({
                  data: {
                    userId: sessionUser.id,
                    language: locale,
                  },
                });
              }
            } catch (error) {
              console.error("Error inserting user into the database:", error);
              return false; // Do not continue with the sign-in process
            }
          } else {
            // User exists, update their details in the Users table
            try {
              const user = await db.user.update({
                where: {
                  id: userExists.id,
                },
                data: {
                  googleId: googleId,
                  name: userExists.name ? userExists.name : name,
                },
              });
            } catch (error) {
              console.error("Error updating user in the database:", error);
              return false; // Do not continue with the sign-in process
            }
          }
        } else if (account?.provider === "facebook") {
          console.log("Facebook Profile:", profile);
          const {
            id: facebookId,
            name,
            email,
            picture,
            email_verified,
            locale,
          } = profile as any;
          if (!facebookId) {
            return false; // Do not continue with the sign-in process
          }
        } else if (account?.provider === "twitter") {
          console.log("Twitter Profile:", profile);
          const {
            id_str: twitterId,
            name,
            email,
            picture,
            email_verified,
            locale,
            screen_name,
            location,
            description,
            profile_image_url_https,
          } = profile as any;
          if (!twitterId) {
            return false; // Do not continue with the sign-in process
          }

          // Check if the user exists in your database based on their email
          try {
            const userExists = await db.user.findFirst({
              where: {
                OR: [{ email: email }, { twitterId: twitterId.toString() }],
              },
            });

            if (!userExists) {
              // User doesn't exist, add them to the Users table
              //create username (login) form email if not exists in db else add number to username
              // remove =s96-c from image url
              const image = profile_image_url_https.replace("_normal", "");
              let username = screen_name;
              let usernameExists = await db.user.findUnique({
                where: {
                  username: username,
                },
              });
              if (usernameExists) {
                username = username + Math.floor(Math.random() * 10000);
              }
              try {
                const sessionUser = await db.user.create({
                  data: {
                    name: name,
                    email: email,
                    image: image,
                    twitterId: twitterId,
                    username: username,
                    bio: description,
                    location: location,
                  },
                  select: {
                    id: true,
                  },
                });

                await db.userWebsite.create({
                  data: {
                    userId: sessionUser.id,
                    value: `https://twitter.com/${screen_name}`,
                  },
                });

                const userSettingsExists = await db.userSettings.findFirst({
                  where: {
                    userId: sessionUser.id,
                  },
                });
                if (!userSettingsExists) {
                  await db.userSettings.create({
                    data: {
                      userId: sessionUser.id,
                      language: locale ? locale : "en",
                    },
                  });
                }
              } catch (error) {
                console.error("Error inserting user into the database:", error);
                return false; // Do not continue with the sign-in process
              }
            } else {
              // User exists, update their details in the Users table
              try {
                const user = await db.user.update({
                  where: {
                    id: userExists.id,
                  },
                  data: {
                    twitterId: twitterId.toString(),
                    name: userExists.name ? userExists.name : name,
                  },
                });

                const urlExists = await db.userWebsite.findFirst({
                  where: {
                    userId: userExists.id,
                    value: `https://twitter.com/${screen_name}`,
                  },
                });

                if (!urlExists) {
                  await db.userWebsite.create({
                    data: {
                      userId: userExists.id,
                      value: `https://twitter.com/${screen_name}`,
                    },
                  });
                }
              } catch (error) {
                console.error("Error updating user in the database:", error);
                return false; // Do not continue with the sign-in process
              }
            }
          } catch (error) {
            console.error("Error updating user in the database:", error);
            return false; // Do not continue with the sign-in process
          }
        }
      }
      return true; // Continue sign-in process
    },
    async jwt({ token, user, account }) {
  // On initial sign-in, user object is available
  if (user) {
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
    token.picture = user.image;
    return token;
  }

  // On subsequent calls, fetch from DB using the token ID
  if (token.id) {
    const dbUser = await db.user.findUnique({
      where: {
        id: token.id,
      },
    });

    if (dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        email: dbUser.email,
        picture: dbUser.image,
      };
    }
  }

  return token;
},
    async session({ token, session }) {
     if (token) {
       session.user = {
         id: token.id as string,
         name: token.name as string,
         email: token.email as string,
         image: token.picture as string,
         username: token.username as string,
       };
     }
     return session;
   },
  },
} satisfies NextAuthConfig;

// We recommend doing your own environment variable validation
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NEXTAUTH_SECRET: string;

      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
    }
  }
}
