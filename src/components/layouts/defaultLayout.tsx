import FlexContainer from "@/components/common/flexContainer";

type Props = {
  children: React.ReactNode;
};

export default async function NavigationLayout({ children }: Props) {
  return <FlexContainer centered>{children}</FlexContainer>;
}
