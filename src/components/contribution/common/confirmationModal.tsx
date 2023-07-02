import { ConfigWithContribution } from "@/types";
import { SubmitState } from "../formClient";
import { HiCheck, HiX } from "react-icons/hi";
import { destructureMeta } from "@/lib/helpers/destructureMeta";
import { decorateFormData } from "@/lib/helpers/decorateFormData";
import Report from "./report";

type Props = {
  state: SubmitState;
  setState: (a: any) => void;
  config: ConfigWithContribution;
};

function ConfirmationModalInner({ state: { data }, config }: Props) {
  console.log("rendering");
  const destructured = destructureMeta(data);
  const { formData } = decorateFormData({ ...destructured, config });
  return <Report formData={formData} />;
}

export default function ConfirmationModal(props: Props) {
  const { state, setState } = props;
  // check if we need to render and don't do any hard work if not
  return (
    <dialog
      id="confirmation_modal"
      className="modal"
      onClose={() => setState({ ...state, confirming: false })}
    >
      <form method="dialog" className="modal-box text-left max-w-xl space-y-6">
        <div className="text-lg font-bold text-center">Confirm Pull Requst</div>
        {state.data && <ConfirmationModalInner {...props} />}
        <div className="flex space-x-2 pt-2">
          {/* if there is a button in form, it will close the modal */}
          {/* {state.sb} */}
          <div className="flex-auto">
            <button className="btn">
              <HiX />
              Cancel
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={async () => {
              setState({ ...state, submitting: true });
              try {
                const res = await fetch(`/api/contribute`, {
                  method: "POST",
                  body: JSON.stringify(state.data),
                });
                const json = await res.json();
                if (!res.ok) {
                  throw new Error(json.error);
                }
                if (!json.pr) {
                  throw new Error("Unexpected response");
                }
                setState(json);
              } catch (error) {
                setState({
                  error: (error as Error).message || "Unknown Error",
                });
              }
            }}
          >
            <HiCheck />
            Confirm
          </button>
        </div>
      </form>
    </dialog>
  );
}
