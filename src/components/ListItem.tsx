import { FC } from "react";
import { List } from "@raycast/api";
import { Name } from "../interfaces";

export interface ListItemProps {
  name: Name;
  index: number;
}

const ListItem: FC<ListItemProps> = ({ name, index }) => (
  <List.Item
    accessories={[{ text: `#${index + 1}` }]}
    key={name.name}
    title={name.name}
    detail={<List.Item.Detail markdown={name.reason} />}
  />
);

export default ListItem;
