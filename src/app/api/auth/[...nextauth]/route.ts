//@ts-nocheck

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import { compare } from "bcryptjs";

// Connexion à la base de données MySQL
const db = await mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        mot_de_passe: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.mot_de_passe) {
          return null;
        }

        try {
          const [rows] = await db.query(
            "SELECT * FROM utilisateurs WHERE email = ?",
            [credentials.email]
          );
          const user = Array.isArray(rows) ? rows[0] : null;

          if (user && await compare(credentials.mot_de_passe, user.mot_de_passe)) {
            return {
              id: user.id.toString(),
              email: user.email,
              nom: user.nom,
              prenom: user.prenom,
              role: user.role,
            };
          }
          return null; // Mot de passe incorrect ou utilisateur non trouvé
        } catch (error) {
          console.error("Erreur lors de l'authentification : ", error);
          return null; // Retourne null en cas d'erreur de la base de données
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nom = user.nom;
        token.prenom = user.prenom;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.nom = token.nom;
      session.user.prenom = token.prenom;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
