import { HiOutlineInformationCircle } from "react-icons/hi";

export type InfoField = {
  type: "info";
  text: string;
  visible?: (values: any) => boolean;
};

export default function InfoField({ text }: InfoField) {
  return (
    <div className="flex text-sm text-secondary my-10 items-center justify-center gap-2">
      <div>
        <HiOutlineInformationCircle className="h-5 w-5" />
      </div>
      <div className="text-left">{text}</div>
    </div>
  );
}
