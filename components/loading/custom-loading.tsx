import Image from "next/image";

export default function CustomLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Image
        className="animate-pulse duration-700"
        src="/icons/logo.svg"
        alt="Logo"
        width={100}
        height={100}
        priority
      />
    </div>
  );
}
