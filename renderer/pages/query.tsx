import { FormEvent, useEffect, useRef, useState } from "react";
import { ipcRenderer } from "electron";

import TextInput from "../components/TextInput";
import { Field, Row } from "../types/db";
import { QueryHistory } from "../types/history";

function QueryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleMakeQuery(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();

    setIsLoading(true);
    setShowTable(false);
    ipcRenderer.send("make-raw-query-req", inputRef.current.value);
  }

  useEffect(() => {
    ipcRenderer.on("make-raw-query-res", (_, data) => {
      const parsed = JSON.parse(data);
      setIsLoading(false);
      setRows(parsed.rows);
      setFields(parsed.fields);
      setShowTable(true);
    });

    ipcRenderer.on("raw-query-res", (_, data) => {
      setQueryHistory((state) => [...state, JSON.parse(data)]);
    });

    return () => {
      ipcRenderer.removeAllListeners("make-raw-query-res");
      ipcRenderer.removeAllListeners("raw-query-res");
    };
  }, []);

  return (
    <>
      <div className="h-screen w-full bg-base-200 grid grid-cols-[1fr,400px]">
        <div className="container max-w-7xl">
          <form onSubmit={handleMakeQuery} className="mt-8">
            <TextInput ref={inputRef} placeholder="type anything" />
          </form>

          {isLoading && (
            <>
              <div className="flex justify-center mt-12">
                <div className="loading"></div>
              </div>
            </>
          )}

          {showTable && (
            <div className="card mt-8">
              <div className="card-body bg-base-100 rounded-lg">
                <div className="overflow-x-auto">
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
                            <th key={row[field.name]}>{row[field.name]}</th>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="left-panel bg-base-300 flex flex-col justify-between">
          <div className="container py-8">
            <h1 className="text-xl mb-8">History</h1>

            {queryHistory.map((query, key) => (
              <div className="cursor-pointer card card-compact mb-4" key={key}>
                <div className="card-body bg-base-100 rounded-xl">
                  <small>{query.prompt}</small>
                  <p className="font-bold">{query.raw}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default QueryPage;
