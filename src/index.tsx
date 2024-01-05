/* eslint-disable no-empty */
import { useState, useRef } from "react";
import { AI, List, Icon, ActionPanel, Action, Detail } from "@raycast/api";
import { getPrompt } from "./utils";
import { LANGS, DEFAULT_CONFIG } from "./cons";
import { Name, Config, Mode } from "./interfaces";
import Empty from "./components/Empty";
import ListItem from "./components/ListItem";

export default function Command() {
  const langRef = useRef<string>("");
  const searchTextRef = useRef<string>("");
  const [mode, setMode] = useState<Mode>("SEARCH");
  const [data, setData] = useState<string | Name[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showingDetail, setShowingDetail] = useState<boolean>(false);
  const config = DEFAULT_CONFIG as Config;

  const submit = async () => {
    if (langRef.current && searchTextRef.current) {
      setLoading(true);
      const prompt = getPrompt({ locale: config.locale, lang: langRef.current, description: searchTextRef.current });
      const answer = await AI.ask(prompt, { model: config.model });
      let res;
      try {
        res = JSON.parse(answer);
        setShowingDetail(true);
        setMode("INPUT");
      } catch (error) {
        res = answer;
        setMode("VIEW");
      }
      setData(res);
      setLoading(false);
    }
  };

  const renderNameItem = (name: Name, index: number): JSX.Element => {
    return <ListItem key={name.name} name={name} index={index} />;
  };

  const handleLangChange = (value: string) => {
    langRef.current = value;
    submit();
  };

  const handleSearchTextChange = (value: string) => {
    searchTextRef.current = value;
  };

  if (mode === "VIEW") {
    return (
      <Detail
        markdown={data as string}
        actions={
          <ActionPanel>
            <Action title="Search" icon={Icon.Book} onAction={() => setMode("SEARCH")} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={showingDetail}
      searchBarAccessory={
        <List.Dropdown tooltip="Select Lang" onChange={handleLangChange}>
          {LANGS.map((lang: string, index: number) => (
            <List.Dropdown.Item title={lang} value={lang} key={`${lang}-${index}`} />
          ))}
        </List.Dropdown>
      }
      onSearchTextChange={handleSearchTextChange}
      actions={
        <ActionPanel>
          <Action title="Submit" icon={Icon.Book} onAction={() => submit()} />
        </ActionPanel>
      }
    >
      {data && data.length && typeof data !== "string" ? (
        <List.Section title="Names" subtitle={`${data.length}`}>
          {data?.map(renderNameItem)}
        </List.Section>
      ) : (
        <Empty />
      )}
    </List>
  );
}
