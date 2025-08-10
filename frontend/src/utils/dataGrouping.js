
export const getUniqueGroupedData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      item.forEach((value, index) => {
        acc[index] = acc[index] || new Set();
        acc[index].add(value);
      });
      return acc;
    }, []);

    return groupedData.map((group) => Array.from(group));
  };