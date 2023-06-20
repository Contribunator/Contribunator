import FlexContainer from "@/components/common/flexContainer";

type Props = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: Props) {
  return <FlexContainer centered>{children}</FlexContainer>;
}
