import { GoogleGeminiEffect } from "@/components/effects/google-gemini-effect";

export default function Hero() {
  return (
    <div className="flex flex-col items-center gap-y-6 text-center">
      <h1 className="text-5xl font-extrabold text-primary">
        Welcome to ElysianStart
      </h1>
      <p className="text-xl font-normal text-muted-foreground">
        Connect with leading companies worldwide for success in the realm of
        development
      </p>
      <GoogleGeminiEffect />
    </div>
  );
}
