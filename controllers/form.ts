// Create
export const create = async (req: any, res: any) => {
  try {
    const { firstName, lastName, phone, branch, appoint_date, appoint_time } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !branch ||
      !appoint_date ||
      !appoint_time
    ) {
      return res.status(400).json({ msg: "Please entry all of information!" });
    }

    const result = await req.sql`
            WITH checkCount (count) AS (
              SELECT COUNT(*) as count FROM aplifly 
              WHERE branch_id = ${branch} AND appoint_date = ${appoint_date} AND appoint_time = ${appoint_time}
            )
            INSERT INTO aplifly (first_name, last_name, phone, branch_id, appoint_date, appoint_time)
            SELECT ${firstName}, ${lastName}, ${phone}, ${branch}, ${appoint_date}, ${appoint_time} FROM checkCount WHERE count < 5 
            RETURNING id`;

    if (result === 0) {
      return res.status(409).json({ msg: "เต็มแล้วนะ" });
    }

    res.json(result);
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).json({ msg: err.message });
  }
};

// Create For Seach
export const dataSearch = async (req: any, res: any) => {
  try {
    const data = req.sql`SELECT aplifly.id, aplifly.first_name, aplifly.last_name, aplifly.phone, branch.branch, aplifly.appoint_date, extract(epoch from appoint_date), aplifly.appoint_time FROM aplifly INNER JOIN branch ON aplifly.branch_id = branch.id`;

    res.json(data);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Read
export const data = async (req: any, res: any) => {
  try {
    const result = await req.sql`SELECT * FROM aplifly`;

    res.json(result);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Read
export const checkBooking = async (req: any, res: any) => {
  try {
    const result =
      await req.sql`SELECT branch_id, appoint_date, appoint_time, COUNT(*) FROM aplifly GROUP BY branch_id, appoint_date, appoint_time`;

    res.json(result);

    console.log(result);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};
