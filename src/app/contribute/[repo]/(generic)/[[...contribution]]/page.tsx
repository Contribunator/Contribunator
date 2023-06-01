import withFormPage from "@/components/form/withFormPage";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div>
      TODO Generic Form page.
      {children}
    </div>
  );
}

function Form() {
  return <div>Form Goes Here</div>;
}

export default withFormPage(Container, Form);
