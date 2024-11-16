
// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;
//     console.log("token");
//     console.log(token);

//     const isAdmin = token?.role === "ADMIN";
//     const isEditor = token?.role === "EDITOR";

//     // Protect admin routes
//     if (req.nextUrl.pathname.startsWith("/admin")) {
//       if (!isAdmin && !isEditor) {
//         return NextResponse.redirect(new URL("/", req.url));
//       }

//       // Only allow admins to access user management
//       if (req.nextUrl.pathname.startsWith("/admin/users") && !isAdmin) {
//         return NextResponse.redirect(new URL("/admin", req.url));
//       }
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = {
//   matcher: ["/admin/:path*"],
// };