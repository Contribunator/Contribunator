import { useField } from "formik";
import {
  HiChevronDoubleLeft,
  HiChevronDown,
  HiChevronLeft,
} from "react-icons/hi";

export default function ChoiceInput({
  name,
  options,
}: {
  name: string;
  options: { [key: string]: { text: string } };
}) {
  // todo option to show buttons instead of dropdown
  const [field, meta, helpers] = useField(name);
  return (
    <div className="form-control">
      <div className="flex items-center space-x-2">
        <div className="dropdown">
          <label tabIndex={0} className="btn">
            {options[field.value].text}
            <HiChevronDown className="ml-2" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
          >
            {Object.keys(options)
              .filter((name) => name !== field.value)
              .map((name) => (
                <li key={name}>
                  <a
                    onClick={() => {
                      (document.activeElement as HTMLElement)?.blur();
                      helpers.setValue(name);
                    }}
                  >
                    {options[name].text}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        {!field.value && (
          <label className="label label-text">
            <HiChevronLeft className="mr-1" />
            Change to reply or retweet
          </label>
        )}
      </div>
    </div>
  );
}
