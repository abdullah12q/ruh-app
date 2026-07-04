export const AUTH_ERROR_MESSAGES = {
  AccessDenied: {
    title: "Sign-in Cancelled",
    description:
      "You cancelled the sign-in process. No worries — whenever you are ready, you can try again.",
    icon: "🚪",
  },
  Configuration: {
    title: "Sign-in Cancelled or Failed",
    description:
      "You may have cancelled the sign-in, or an issue occurred during authentication. No worries — you can try again whenever you're ready.",
    icon: "🚪",
  },
  Verification: {
    title: "Link Expired",
    description:
      "The sign-in link has expired or has already been used. Please request a new one.",
    icon: "⏳",
  },
  OAuthCallback: {
    title: "OAuth Error",
    description:
      "There was an error during the sign-in callback. Please try signing in again.",
    icon: "🔗",
  },
  Default: {
    title: "Authentication Error",
    description:
      "An unexpected error occurred during sign-in. Please try again.",
    icon: "⚠️",
  },
};
