import { HiOutlineInformationCircle } from "react-icons/hi";

export type Props = {
  type: "info";
  title: string;
  icon?: boolean;
};

export default function InfoField({ title, icon }: Props) {
  return (
    <div className="flex text-secondary pt-6 first:pt-2 items-center justify-center font-bold text-sm">
      <div>{icon && <HiOutlineInformationCircle className="h-5 w-5" />}</div>
      <div className="text-left">{title}</div>
    </div>
  );
}
