import { useSWRConfig } from "swr";
import { useState } from "react";

export default function FormAndMethod({
  children,
  className,
  method,
  url,
  keyValue,
  trigger,
  setOpen,
}) {
  const { mutate } = useSWRConfig();
  const [errors, setErrors] = useState({});
  const [error, SError] = useState(false);

  async function handleSubmit(event, method, url, keyValue) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const objectFromFormData = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFromFormData);
    const requestOptions = {
      method: method,
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `${window.location.protocol}//${window.location.host}//${url}`,
      requestOptions
    );
    if (response.status == 201 || response.status == 200) {
      const responseData = await response.json();
      if (trigger) {
        trigger(keyValue);
      } else {
        mutate(keyValue);
      }
      if (setOpen) {
        setOpen(false);
      }
    } else {
      const data = await response.json();
      console.log(data, "these are errors");
      setErrors(data);
      SError(true);
    }
  }

  return (
    <div>
      {error && errors?.data && errors?.data?.messages && (
        <div
          className={
            "bg-destructive p-3 m-8 font-semibold text-sm rounded-md text-white"
          }
        >
          {Object.values(errors?.data?.messages)}
        </div>
      )}
      <form
        className={className}
        onSubmit={(event) => handleSubmit(event, method, url, keyValue)}
      >
        {children}
      </form>
    </div>
  );
}
