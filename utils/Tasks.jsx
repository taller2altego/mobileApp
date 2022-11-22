import React from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

export const FETCH_TRAVEL = "fetch_travel";

export const addNewTask = (name, fn) => {
  if (!TaskManager.isTaskDefined(name)) {
    TaskManager.defineTask(name, fn);
  }
};

export const createNewTask = (name) => {
  return BackgroundFetch.registerTaskAsync(name, {
    minimumInterval: 1,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

export const deleteTask = (name) => {
  return BackgroundFetch.unregisterTaskAsync(name);
};

export async function initBackgroundFetch(taskName, taskFn, interval = 1) {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      TaskManager.defineTask(taskName, taskFn);
    }
    const options = {
      minimumInterval: interval, // in seconds
    };
    await BackgroundFetch.registerTaskAsync(taskName, options);
  } catch (err) {
    console.log("registerTaskAsync() failed:", err);
  }
}
