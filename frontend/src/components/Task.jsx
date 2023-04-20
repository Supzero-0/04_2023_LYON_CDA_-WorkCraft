import { Card, Typography, CardContent, Skeleton } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Task({ taskId }) {
  const [task, setTask] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost/api/tasks/${taskId}.json`)
      .then((res) => {
        console.info(res.data);
        setTask(res.data);
      })
      .catch((err) => {
        console.error(`Axios Error : ${err.message}`);
      });
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Object.keys(task).length > 0 ? ( // check if task is filled or empty
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 16, fontWeight: "bold" }}
              color="primary"
            >
              {task.title}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="initial">
              {task.description}
            </Typography>
            <Typography sx={{ fontSize: 10 }} color="initial">
              {`Modules : ${task.modules
                .map((module) => (module.isDone ? 1 : 0))
                .reduce((accumulator, current) => accumulator + current)} / ${
                task.modules.length
              }`}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={210}
          height={Math.floor(Math.random() * 80) + 20}
        />
      )}
    </div>
  );
}

Task.propTypes = {
  taskId: PropTypes.number.isRequired,
};