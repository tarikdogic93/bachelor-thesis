import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (!isProtectedRoute(request) && auth().userId) {
    const dashboardUrl = new URL("/dashboard", request.url);

    return NextResponse.redirect(dashboardUrl);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
