import useFetch from "@/components/hooks/useFetch";
import { Card, DataTable, Page } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ActiveWebhooks = () => {
  const router = useRouter();
  const fetch = useFetch();

  const [rows, setRows] = useState([
    ["Loading", "I haven't implemented swr or react query yet."],
  ]);

  //MARK:- Replace this amazing fetch + state implementation with `swr` or `react-query`.
  async function fetchWebhooks() {
    const res = await fetch("/api/apps/debug/activeWebhooks");
    const data = await res.json();
    let rowData = [];
    Object.entries(data.body.data.webhookSubscriptions.edges).map(
      ([key, value]) => {
        const topic = value.node.topic;
        const callbackUrl = value.node.endpoint.callbackUrl;
        rowData.push([topic, callbackUrl]);
      }
    );
    setRows(rowData);
  }

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return (
    <>
      <Page
        title="Webhooks"
        breadcrumbs={[
          { content: "Home", onAction: () => router.push("/debug") },
        ]}
      >
        <Card>
          <DataTable
            columnContentTypes={["text", "text"]}
            headings={["Topic", "Callback Url"]}
            rows={rows}
          />
        </Card>
        <Card title="Webhook URLs" sectioned>
          <p>
            Webhooks are registered when the app is installed, or when tokens
            are refetched by going through the authentication process. If your
            Callback URL isn't the same as your current URL (happens usually
            during dev when using ngrok), you need to go through the auth
            process again.
          </p>
        </Card>
      </Page>
    </>
  );
};

export default ActiveWebhooks;