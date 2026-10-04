import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "h-11 w-11",
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-lg bg-white ${className}`}>
      <Image
        src="/branding/dakshana-iitg-logo.png"
        alt="Dakshana IIT Guwahati logo"
        fill
        priority={priority}
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}
