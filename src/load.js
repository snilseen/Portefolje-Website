// Henter referanser til HTML-elementer
const form = document.getElementById("contact-form");
const projectsList = document.getElementById("projects-wrapper");
const projects = []; // Intern liste med prosjekter

// Legger til en lytter som fanger opp sending av skjema
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Forhindrer standard oppførsel ved sending av skjema

  // Oppretter et nytt prosjektobjekt basert på brukerens input
  const newProject = {
    title: event.target.elements.name.value,
    "tech-used": event.target.elements["tech-used"].value.split(","), // Splitt på komma for å få en array av tech-stacken
    link: event.target.elements.subject.value,
    description: event.target.elements.description.value,
    createdAt: new Date(),
  };

  projects.push(newProject); // Legger til det nye prosjektet i den interne listen
  updateProjectsList(); // Oppdaterer visningen av prosjekter på nettsiden

  // Forsøker å sende prosjektet til serveren
  try {
    const response = await fetch("http://localhost:3999/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    });

    // Håndterer serverresponsen
    if (response.status === 201) {
      console.log("Prosjekt lagret på serveren");
      document.getElementById("success").style.display = "block"; // Viser suksessmelding
      document.getElementById("failure").style.display = "none";
    } else {
      console.error("Feil ved lagring av prosjekt på serveren");
      document.getElementById("success").style.display = "none";
      document.getElementById("failure").style.display = "block"; // Viser feilmelding
    }
  } catch (error) {
    console.error("Feil ved sending av data til serveren:", error);
    document.getElementById("success").style.display = "none";
    document.getElementById("failure").style.display = "block"; // Viser feilmelding
  }
});

// Funksjon for å oppdatere visningen av prosjekter på nettsiden
function updateProjectsList() {
  console.log(projects);
  projectsList.innerHTML = ""; // Tømmer listen før ny oppdatering

  // Legger til hvert prosjekt som et listeelement
  for (const project of projects) {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-container");

    const elTitle = document.createElement("h2");
    const elUsedTech = document.createElement("ul");
    const elDescription = document.createElement("p");
    const elLink = document.createElement("a");

    elTitle.textContent = project.title;

    project["tech-used"].forEach((tech) => {
      const techItem = document.createElement("li");
      techItem.textContent = tech;
      elUsedTech.appendChild(techItem);
    });

    elDescription.textContent = project.description;
    elLink.textContent = "Se prosjektet";
    elLink.href = project.link;

    projectDiv.appendChild(elTitle);
    projectDiv.appendChild(elUsedTech);
    projectDiv.appendChild(elDescription);
    projectDiv.appendChild(elLink);

    projectsList.appendChild(projectDiv);
  }
}

function loadFromApi() {
  fetch("http://localhost:3999")
    .then((response) => response.json())
    .then((data) => {
      projects.push(...data); // Legger til prosjekter fra API-et i den interne listen
      updateProjectsList(); // Oppdaterer visningen på nettsiden
    })
    .catch((error) => {
      console.error("Feil ved henting av data fra serveren:", error);
    });
}

console.log("Script loading json load.js");

function loadFromJSON() {
  fetch("../data.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const dataDiv = document.getElementById("projects-wrapper");
      console.log(data);

      data.forEach((project) => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-container");
        const elTitle = document.createElement("h2");
        const elUsedTech = document.createElement("ul");
        const elDescription = document.createElement("p");
        const elLink = document.createElement("a");

        elTitle.textContent = project.title;

        project["tech-used"].forEach((tech) => {
          const techItem = document.createElement("li");
          techItem.textContent = tech;

          elUsedTech.appendChild(techItem);
        });

        elDescription.textContent = project.description;
        elLink.textContent = "Se prosjektet";
        elLink.href = project.link;

        projectDiv.appendChild(elTitle);
        projectDiv.appendChild(elUsedTech);
        projectDiv.appendChild(elDescription);
        projectDiv.appendChild(elLink);

        dataDiv.appendChild(projectDiv);
      });
    })
    .catch((error) => {
      console.error("Error ved henting av datas:", error);
    });
}

loadFromJSON();
loadFromApi();
