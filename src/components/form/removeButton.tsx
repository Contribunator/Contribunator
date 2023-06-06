import { HiXCircle } from "react-icons/hi";

export default function RemoveButton({
  className = "btn-sm",
  ...props
}: { className?: string } & any) {
  return (
    <div
      className={`btn btn-error absolute top-2 right-2 z-10 gap-2 ${className}`}
      {...props}
    >
      <HiXCircle /> Remove
    </div>
  );
}
