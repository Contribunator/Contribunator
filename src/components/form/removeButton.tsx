import { HiXCircle } from "react-icons/hi";

export default function RemoveButton({
  className = "btn-sm top-2 right-2",
  ...props
}: { className?: string } & any) {
  return (
    <div
      className={`btn btn-error absolute z-10 gap-2 ${className}`}
      {...props}
    >
      <HiXCircle /> Remove
    </div>
  );
}
