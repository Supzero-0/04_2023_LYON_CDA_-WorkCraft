import {
  Card,
  List,
  ListItem,
  CardHeader,
  CardContent,
  IconButton,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  CardActions,
  Button,
  ClickAwayListener,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import Task from "./Task";
import CreateInputMenu from "./CreateInputMenu";
import ApiHelper from "../helpers/apiHelper";
import loadData from "../helpers/loadData";

export default function TasksList({
  listId,
  deleteList,
  editList,
  reloadList,
}) {
  const [list, setList] = useState({});
  const [tasks, setTasks] = useState([]);
  const [reloadTasks, setReloadTasks] = useState(false);
  const [newListName, setNewListName] = useState(list.title);
  const [isEditActive, setIsEditActive] = useState(false);
  const [anchorMenuElement, setAnchorMenuElement] = useState(null);
  const [isCreateInputActive, setIsCreateInputActive] = useState(false);
  const isMenuOpen = Boolean(anchorMenuElement);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => loadData("project_lists", setList, listId), [reloadList]);
  useEffect(
    () => loadData("project_lists", setTasks, `${listId}/tasks`),
    [reloadTasks]
  );

  const handleClick = (event) => {
    setAnchorMenuElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorMenuElement(null);
  };

  const handleEditList = () => {
    handleClose();
    setNewListName(list.title);
    setIsEditActive(true); // Reset the editing state variable
  };

  const handleCloseEditList = () => {
    editList(listId, newListName);
    setIsEditActive(false);
    setNewListName("");
  };

  const createTask = (taskName) => {
    ApiHelper(`tasks`, "post", {
      title: taskName,
      description: "",
      list: `api/project_lists/${listId}`,
    })
      .then(() => {
        setReloadTasks(!reloadTasks);
        enqueueSnackbar(`Task "${taskName}" successfully created`, {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("An error occurred, Please try again.", {
          variant: "error",
        });
      });
  };

  const handleDeleteListButton = () => {
    handleClose();
    deleteList(listId, list.title);
  };

  const editTask = (taskId, newTaskName) => {
    ApiHelper(
      `tasks/${taskId}`,
      "patch",
      {
        title: newTaskName,
      },
      "application/merge-patch+json"
    ).then(() => {
      setReloadTasks(!reloadTasks);
    });
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      {isEditActive ? (
        <ClickAwayListener onClickAway={() => handleCloseEditList()}>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              variant="standard"
              sx={{ width: "100%" }}
              value={newListName}
              onKeyDown={(e) => e.key === "Enter" && handleCloseEditList()}
              onChange={(e) => setNewListName(e.target.value)}
              ref={(input) => input && input.focus()}
            />
          </form>
        </ClickAwayListener>
      ) : (
        <CardHeader
          title={list.title}
          align="center"
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
        />
      )}
      <CardContent>
        <List sx={{ maxHeight: "70vh", overflow: "auto" }}>
          <ListItem sx={{ display: "flex", flexDirection: "column" }}>
            {tasks &&
              tasks.map((task) => (
                <Task
                  key={task.id}
                  taskId={task.id}
                  editTask={editTask}
                  reloadTasks={reloadTasks}
                />
              ))}
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        {isCreateInputActive ? (
          <CreateInputMenu
            onSubmit={createTask}
            onClose={() => setIsCreateInputActive(false)}
            submitTextButton="Create"
            label="Task"
          />
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsCreateInputActive(true)}
          >
            New Task
          </Button>
        )}
      </CardActions>
      <Menu
        id="basic-menu"
        anchorEl={anchorMenuElement}
        open={isMenuOpen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={() => handleEditList()}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteListButton}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}

TasksList.propTypes = {
  listId: PropTypes.number.isRequired,
  deleteList: PropTypes.func.isRequired,
  editList: PropTypes.func.isRequired,
  reloadList: PropTypes.bool.isRequired,
};
