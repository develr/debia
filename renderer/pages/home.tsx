import { useEffect } from "react";
import { ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import TextInput from "../components/TextInput";
import Select from "../components/Select";

const validationSchema = z.object({
  host: z.string().min(1, { message: "Host is required" }),
  user: z.string().min(1, { message: "User is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  database: z.string().min(1, { message: "Database is required" }),
  port: z.string().min(1, { message: "Port is required" }),
  token: z.string().min(1, { message: "Token is required" }),
  client: z.string(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

function Home() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    ipcRenderer.on("connect-database-res", (_, data) => {
      if (JSON.parse(data).status === "error") {
        toast.error("Connecting error");
        return;
      }

      router.push("/query");
    });

    return () => {
      ipcRenderer.removeAllListeners("connect-database-res");
    };
  }, []);

  function handleConnectToDatabase(formData: ValidationSchema) {
    ipcRenderer.send(
      "connect-database-req",
      JSON.stringify({
        ...formData,
      })
    );
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="card w-96 bg-neutral text-neutral-content">
          <div className="card-body">
            <div className="tabs tabs-boxed">
              <a className="tab tab-boxed w-2/4 tab-active">Standard</a>
              <a className="tab tab-boxed w-2/4 tab-disabled">Connect URL</a>
            </div>

            <form onSubmit={handleSubmit(handleConnectToDatabase)}>
              <Select label="Database Client" {...register("client")}>
                <option value="pg">Postgres</option>
                <option value="mysql">MySQL</option>
              </Select>
              <TextInput
                label="Host"
                error={errors.host?.message as string}
                {...register("host")}
              />
              <TextInput
                label="Port"
                type="number"
                error={errors.port?.message as string}
                {...register("port")}
              />
              <TextInput
                label="Database name"
                error={errors.database?.message as string}
                {...register("database")}
              />
              <TextInput
                label="User"
                error={errors.user?.message as string}
                {...register("user")}
              />
              <TextInput
                label="Password"
                type="password"
                error={errors.password?.message as string}
                {...register("password")}
              />
              <TextInput
                label="OpenAI Token"
                type="password"
                error={errors.token?.message as string}
                {...register("token")}
              />

              <button type="submit" className="btn btn-primary mt-4 w-full">
                connect
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
