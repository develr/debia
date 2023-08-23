import { SelectHTMLAttributes, forwardRef } from "react";

type SelectProps = {
  label?: string;
  children: React.ReactNode;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return (
    <>
      <div className="form-control w-full">
        {!!props.label && (
          <label className="label">
            <span className="label-text">{props.label}</span>
          </label>
        )}

        <select
          className="select select-bordered font-normal rounded-lg"
          {...props}
          ref={ref}
        >
          {props.children}
        </select>

        {!!props.error && (
          <label className="label">
            <span className="label-text-alt text-red-400 ">{props.error}</span>
          </label>
        )}
      </div>
    </>
  );
});

export default Select;
