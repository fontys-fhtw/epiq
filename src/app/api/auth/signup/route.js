import { hash } from 'bcryptjs'; // For password hashing
// import your database connection logic here

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validate the input
    if (!username || !password) {
      return new Response(JSON.stringify({ message: 'Username and password are required' }), { status: 400 });
    }

    // Check if the username already exists in the database (replace this with your actual logic)
    // const existingUser = await db.users.findUnique({ where: { username } });
    const existingUser = false; // Simulating no user for demo purposes
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Username already taken' }), { status: 409 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Save the new user to the database (replace this with your actual database insertion logic)
    // await db.users.create({ data: { username, password: hashedPassword } });

    // Respond with success
    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}
