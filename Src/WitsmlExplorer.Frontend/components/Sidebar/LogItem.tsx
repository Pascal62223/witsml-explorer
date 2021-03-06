import React, { useContext } from "react";
import TreeItem from "./TreeItem";
import Wellbore from "../../models/wellbore";
import Well from "../../models/well";
import LogObject from "../../models/logObject";
import LogObjectContextMenu, { LogObjectContextMenuProps } from "../ContextMenus/LogObjectContextMenu";
import OperationContext from "../../contexts/operationContext";
import NavigationContext from "../../contexts/navigationContext";
import OperationType from "../../contexts/operationType";
import NavigationType from "../../contexts/navigationType";
import { getContextMenuPosition, preventContextMenuPropagation } from "../ContextMenus/ContextMenu";
import { Server } from "../../models/server";

interface LogItemProps {
  log: LogObject;
  well: Well;
  wellbore: Wellbore;
  logGroup: string;
  logTypeGroup: string;
  selected: boolean;
  nodeId: string;
}

const LogItem = (props: LogItemProps): React.ReactElement => {
  const { log: log, well, wellbore, selected, nodeId } = props;
  const { dispatchOperation } = useContext(OperationContext);
  const {
    dispatchNavigation,
    navigationState: { selectedServer, servers }
  } = useContext(NavigationContext);

  const onContextMenu = (event: React.MouseEvent<HTMLLIElement>, log: LogObject, selectedServer: Server, servers: Server[]) => {
    preventContextMenuPropagation(event);
    const contextProps: LogObjectContextMenuProps = { checkedLogObjectRows: [].concat(log), dispatchNavigation, dispatchOperation, selectedServer, servers };
    const position = getContextMenuPosition(event);
    dispatchOperation({ type: OperationType.DisplayContextMenu, payload: { component: <LogObjectContextMenu {...contextProps} />, position } });
  };

  return (
    <TreeItem
      onContextMenu={(event) => onContextMenu(event, log, selectedServer, servers)}
      key={nodeId}
      nodeId={nodeId}
      labelText={log.runNumber ? `${log.name} (${log.runNumber})` : log.name}
      selected={selected}
      onLabelClick={() => dispatchNavigation({ type: NavigationType.SelectLogObject, payload: { log, well, wellbore } })}
    />
  );
};
export default LogItem;
