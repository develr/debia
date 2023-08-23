import { InputHTMLAttributes, forwardRef } from "react";

type TextInputProps = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <>
      <div className="form-control w-full">
        {!!props.label && (
          <label className="label">
            <span className="label-text">{props.label}</span>
          </label>
        )}

        <input
          {...props}
          className={`input input-bordered w-full rounded-lg block ${props.className}`}
          ref={ref}
        />

        {!!props.error && (
          <label className="label">
            <span className="label-text-alt text-red-400 ">{props.error}</span>
          </label>
        )}
      </div>
    </>
  );
});

export default TextInput;
