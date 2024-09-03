// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "node:fs/promises";

// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS (Cross-Origin Resource Sharing) for alle ruter
app.use("/*", cors());

// Setter opp statisk filbetjening for filer i "static" mappen
app.use("/*", serveStatic({ root: "./" }));

// Initialiserer en liste med prosjekter
const projects = [
  {
    id: crypto.randomUUID(),
    title: "Prosjekt 1",
    "tech-used": ["React", "Typescript", "Hono", "Tailwind"],
    description: "description av prosjekter kan skrives her",
    link: "link til repository eller prosjektet",
  },
  {
    id: crypto.randomUUID(),
    title: "Prosjekt 2",
    "tech-used": ["React", "Typescript", "Hono", "Tailwind"],
    description: "description av prosjekter kan skrives her",
    link: "link til repository eller prosjektet",
  },
  {
    id: crypto.randomUUID(),
    title: "Prosjekt 3",
    "tech-used": ["React", "Typescript", "Hono", "Tailwind"],
    description: "description av prosjekter kan skrives her",
    link: "link til repository eller prosjektet",
  },
];

app.get("/json", async (c) => {
  const data = await fs.readFile("data.json", "utf8");
  const dataAsJson = JSON.parse(data);
  return c.json(dataAsJson);
});

// Definerer POST-ruten for å legge til nye prosjekter
app.post("/add", async (c) => {
  const newProject = await c.req.json(); // Henter prosjektdata fra forespørselen
  projects.push(newProject); // Legger til prosjektet i listen
  return c.json(newProject, 201); // Returnerer det nye prosjektet med status 201 Created
});

// Definerer en POST-rute for å lagre nye prosjekter

/*
app.post("/add", async (c) => {
  const newProject = await c.req.json();
  projects.push(newProject);
  return c.json({ message: "Prosjekt lagt til!", project: newProject });
});
*/
// Definerer en GET-rute for å hente alle prosjekter

app.get("/", (c) => {
  return c.json(projects);
});

// Definerer porten serveren skal lytte på
const port = 3999;

console.log(`Server is running on port ${port}`);

// Starter serveren
serve({
  fetch: app.fetch,
  port,
});
