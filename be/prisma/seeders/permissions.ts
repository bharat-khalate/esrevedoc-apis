export const permissionModules = {
  USER: ["CREATE", "READ", "UPDATE", "DELETE"],

  ROLE: ["CREATE", "READ", "UPDATE", "DELETE"],

  PERMISSION: ["CREATE", "READ", "UPDATE", "DELETE"],

  PROBLEM: ["CREATE", "READ", "UPDATE", "DELETE"],

  TOPIC: ["CREATE", "READ", "UPDATE", "DELETE"],

  SUBMISSION: ["READ", "DELETE"],

  DISCUSSION: ["CREATE", "READ", "UPDATE", "DELETE"],
};

export const permissions = Object.entries(permissionModules).flatMap(
  ([module, actions]) =>
    actions.map((action) => ({
      name: `${action} ${module}`,
      codeName: `${module}_${action}`,
    })),
);
