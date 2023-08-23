import { useEffect } from "react";
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";

import TextInput from "../components/TextInput";
import Select from "../components/Select";

function Home() {
  const router = useRouter();

  const onClickWithIpcSync = () => {
    ipcRenderer.send(
      "connect-database-req",
      JSON.stringify({
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "chatql",
        port: 5432,
      })
    );
  };

  useEffect(() => {
    ipcRenderer.on("connect-database-res", (_, data) => {
      if (JSON.parse(data).status === "error") {
        console.log("erro ao conectar");
        return;
      }

      router.push("/query");
    });

    return () => {
      ipcRenderer.removeAllListeners("connect-database-res");
    };
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="card w-96 bg-neutral text-neutral-content">
          <div className="card-body">
            <div className="tabs tabs-boxed">
              <a className="tab tab-boxed w-2/4 tab-active">Standard</a>
              <a className="tab tab-boxed w-2/4 tab-disabled">Connect URL</a>
            </div>

            <Select label="Database">
              <option value="pg">Postgres</option>
              <option value="mysql">MySQL</option>
            </Select>

            <TextInput label="Host" />
            <TextInput label="Port" type="number" />
            <TextInput label="Database name" />
            <TextInput label="Username" />
            <TextInput label="Password" type="password" />

            <button
              onClick={onClickWithIpcSync}
              className="btn btn-primary mt-4"
            >
              connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
