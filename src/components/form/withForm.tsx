import { Form, Formik } from "formik";
import { usePathname } from "next/navigation";
import GenericOptions from "./genericOptions";

type Config = {
  validation: any;
  initialValues?: any;
};

export type FormProps = {
  data: any;
};

// Mark the function as a generic using P (or whatever variable you want)
export default function withForm<P>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our extraInfo prop
  WrappedComponent: React.ComponentType<P & FormProps>,
  { validation, initialValues = {} }: Config
) {
  // const [extraInfo, setExtraInfo] = useState('');
  // setExtraInfo('important data.');

  const ComponentWithForm = (props: P & { className?: string }) => {
    // At this point, the props being passed in are the original props the component expects.
    const path = usePathname();

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={async (data: any) => {
          console.log(data, path);
          // post to `submit` route
          const res = await fetch(`${path}/submit`, {
            method: "POST",
            body: JSON.stringify(data),
          });
          console.log(await res.json());
        }}
      >
        {(data: any) => (
          <form onSubmit={data.handleSubmit} className={props.className}>
            {/* TODO rename data and only pass relevent props */}
            <WrappedComponent {...props} data={data} />
            {/* TODO add generic commit options */}
            <GenericOptions />
            <div className="form-control">
              <button type="submit" className="btn">
                Create Pull Request
              </button>
            </div>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          </form>
        )}
      </Formik>
    );
  };
  return ComponentWithForm;
}
