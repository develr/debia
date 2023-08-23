import { FormEvent, useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";

import TextInput from "../components/TextInput";
import { Field, Row } from "../types/db";

function QueryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [showTable, setShowTable] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleMakeQuery(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    ipcRenderer.send("make-raw-query-req", inputRef.current.value);
  }

  useEffect(() => {
    ipcRenderer.on("make-raw-query-res", (_, data) => {
      const parsed = JSON.parse(data);
      setRows(parsed.rows);
      setFields(parsed.fields);
      setShowTable(true);
    });

    return () => {
      ipcRenderer.removeAllListeners("make-raw-query-res");
    };
  }, []);

  return (
    <>
      <div className="container max-w-3xl ">
        <form onSubmit={handleMakeQuery} className="mt-8">
          <TextInput
            ref={inputRef}
            placeholder="type anything"
            value={`SELECT * FROM "user";`}
          />
        </form>

        {showTable && (
          <div className="overflow-x-auto mt-8">
            <table className="table">
              <thead>
                <tr>
                  {fields.map((field) => (
                    <th className="uppercase" key={field.columnID}>
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {fields.map((field) => (
                      <th>{row[field.name]}</th>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default QueryPage;
