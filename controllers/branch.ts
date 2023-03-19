// Create
export const createBranch = async (req: any, res: any) => {
  try {
    const { branch } = req.body;

    if (!branch) {
      return res.status(400).json({ msg: "Please entry data." });
    }

    const result = await req.sql`
            INSERT INTO branch ${req.sql({ branch })}
            RETURNING id`;

    res.json(result);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Read
export const branches = async (req: any, res: any) => {
  try {
    const result = await req.sql`SELECT * FROM branch`;

    res.json(result);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};
