import { ConfigWithContribution } from "@/lib/config";
import { GenericConfig } from "./config";

type Props = {
  children: React.ReactNode;
  // TODO ConfigWithContribution<GenericConfig>
  config: ConfigWithContribution & { contribution: GenericConfig };
};

export default function GenericFormContainer({
  children,
  config: { contribution },
  ...props
}: Props) {
  return (
    <>
      <h2 className="title">{contribution.title}</h2>
      <p>{contribution.description}</p>
      {children}
    </>
  );
}
