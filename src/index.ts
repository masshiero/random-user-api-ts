import express, { Request, Response } from "express";

import fetch from "node-fetch";

const app = express();
const PORT = 3000;

interface RandomUser {
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: { number: number; name: string };
    city: string;
    state: string;
    country: string;
  };
  email: string;
  dob: { age: number };
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

app.get("/api/users", async (req: Request, res: Response) => {
  const results = req.query.results || "10";
  const page = req.query.page || "1";

  try {
    const response = await fetch(
      `https://randomuser.me/api/?results=${results}&page=${page}`
    );
    
    const json = await response.json();
    const data = json as { results: RandomUser[] };

    const transformed = data.results.map((user: RandomUser) => ({
      name: `${user.name.title}, ${user.name.first} ${user.name.last}`,
      location: `${user.location.street.number},${user.location.street.name}, ${user.location.city},${user.location.state}, ${user.location.country}`,
      email: user.email,
      age: user.dob.age,
      phone: user.phone,
      cell: user.cell,
      picture: [
        user.picture.large,
        user.picture.medium,
        user.picture.thumbnail,
      ],
    }));

    res.json(transformed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
