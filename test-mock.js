const mockDb = {
  select: () => ({
    from: (table) => {
      console.log("from called with table:", table);
      return Promise.resolve([{ id: 1, name: "test" }]);
    },
  }),
};

(async () => {
  const result = await mockDb.select().from({});
  console.log("Result:", result);
  console.log("Is Array:", Array.isArray(result));
})();
