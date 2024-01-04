import { AI, List, Icon, ActionPanel, Action } from "@raycast/api";
import { getPrompt } from "./utils";
import { LANGS } from "./cons";
import { useState } from "react";
import _ from "lodash";

interface Config {
  model: AI.Model;
  locale: string;
}

export default function Command() {
  const [lang, setLang] = useState<string>("Javascript");
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [desc, setDesc] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const config: Config = {
    model: "gpt-3.5-turbo",
    locale: "en_US",
  };

  const ask = async () => {
    if (desc && lang) {
      setLoading(true);
      const prompt = getPrompt({ locale: config.locale, lang: lang, description: desc });
      const answer = await AI.ask(prompt, { model: config.model });
      console.log("🚀 ~ file: index.tsx:27 ~ ask", answer);
      let res = [];
      try {
        res = JSON.parse(answer);
      } catch (error) {
        console.log("🚀 ~ file: index.tsx:32 ~ ask ~ error:", error);
      }
      console.log("🚀 ~ file: index.tsx:29 ~ ask ~ res:", res);
      setData(res);
      setLoading(false);
    }
  };

  const renderName = ({ name, reason }) => {
    return <List.Item key={name} title={name} subtitle={reason} />;
  };

  console.log(data, "data");

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <List.Dropdown tooltip="Select Lang" value={lang} onChange={(value) => setLang(value)}>
          {LANGS.map((lang: string, index: number) => (
            <List.Dropdown.Item title={lang} value={lang} key={`${lang}-${index}`} />
          ))}
        </List.Dropdown>
      }
      onSearchTextChange={(value: string) => setDesc(value)}
      actions={
        <ActionPanel>
          <Action title="Submit" icon={Icon.Book} onAction={() => ask()} />
        </ActionPanel>
      }
    >
      {data && data.length ? (
        data?.map(renderName)
      ) : (
        <List.EmptyView
          title="Type anything!"
          description={
            "Type your text and hit the enter key\n⌘+P to change language. Using *Switch to Translate ...* to switch from/to."
          }
          icon={Icon.QuestionMark}
        />
      )}
    </List>
  );
  return;
}
