import { HiOutlineInformationCircle } from "react-icons/hi";

export type InfoField = {
  type: "info";
  title: string;
};

export default function InfoField({ title }: InfoField) {
  return (
    <div className="flex text-sm text-secondary my-10 items-center justify-center gap-2">
      <div>
        <HiOutlineInformationCircle className="h-5 w-5" />
      </div>
      <div className="text-left">{title}</div>
    </div>
  );
}
