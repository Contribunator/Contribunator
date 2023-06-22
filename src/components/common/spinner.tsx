import { ImSpinner2 } from "react-icons/im";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <ImSpinner2 className="animate-spin h-20 w-20 opacity-50" />
    </div>
  );
}
