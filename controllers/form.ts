import postgres from "postgres";

// Create
export const create = async (req: any, res: any) => {
  try {
    const { firstName, lastName, phone, branch, appoint_date, appoint_time } =
      req.body;

    const sql = req.sql as postgres.Sql;

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

    const result = await sql<
      {
        id: number;
        name: string;
        branch_name: string;
        telephone: string;
        appoint_date: string;
      }[]
    >`
            WITH checkCount (count) AS (
              SELECT COUNT(*) as count FROM aplifly 
              WHERE branch_id = ${branch} AND appoint_date = ${appoint_date} AND appoint_time = ${appoint_time}
            )
            INSERT INTO aplifly (first_name, last_name, phone, branch_id, appoint_date, appoint_time)
            SELECT ${firstName}, ${lastName}, ${phone}, ${branch}, ${appoint_date}, ${appoint_time} FROM checkCount WHERE count < 10 
            RETURNING id::text, first_name as name, (SELECT branch FROM branch b WHERE b.id = ${branch}) as branch_name, phone as telephone, EXTRACT(epoch FROM appoint_date at time zone '+7' + (appoint_time::integer * INTERVAL '1 hour')) as appoint_date`;

    if (result.length === 0) {
      return res.status(409).json({ msg: "เต็มแล้วนะ" });
    }

    const typesenseRes = await fetch(
      process.env.TYPESENSE_ENDPOINT + "/collections/aplifly/documents",
      {
        method: "POST",
        body: JSON.stringify({
          name: result[0].name,
          branchName: result[0].branch_name,
          telephone: result[0].telephone,
          appointDate: parseFloat(result[0].appoint_date),
        }),
        headers: {
          "X-TYPESENSE-API-KEY": process.env.TYPESENSE_API_KEY || "",
        },
      }
    );

    if (typesenseRes.status !== 201)
      return res.status(500).json({ msg: typesenseRes.statusText });

    res.json(result);
  } catch (err: any) {
    console.log(err.message);
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
