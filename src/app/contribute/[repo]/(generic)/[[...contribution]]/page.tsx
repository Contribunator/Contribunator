import contributionPage from "@/components/contributionPage";

function GenericPage({ children }: { children: React.ReactNode }) {
  return (
    <div>
      TODO generic page.
      {children}
    </div>
  );
}

function GenericForm() {
  return <div>TODO generic form</div>;
}

export default contributionPage(GenericPage, GenericForm);
