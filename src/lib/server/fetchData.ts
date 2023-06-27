import { FetchData, FetchedData } from "@/types";

export default async function fetchData(
  props: FetchData,
  isClient: boolean = false
): Promise<FetchedData> {
  const { useData, useDataOnClient, useDataOnServer } =
    props.config.contribution;

  let fetchedData = {};
  await Promise.all(
    [useData, isClient ? useDataOnClient : useDataOnServer].map(async (fn) => {
      if (!fn) return;
      if (typeof fn !== "function") {
        throw new Error("useData is not a function");
      }
      const data = await fn(props);
      fetchedData = { ...fetchedData, ...data };
    })
  );
  return fetchedData;
}
