import LayoutChangeButton from "@/components/buttons/layout-change-button";

export default function Page() {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-y-6 p-8">
      <div className="flex flex-col gap-y-3 text-center">
        <h2 className="text-3xl font-semibold">Change your layout</h2>
        <p className="text-lg text-muted-foreground">
          Choose from different layouts to easily redefine your website&apos;s
          appearance to suit your desired style.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <LayoutChangeButton position="left" />
        <LayoutChangeButton position="right" />
      </div>
    </div>
  );
}
