const COHORT = "2407-ftb-et-web-ft";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

async function render() {
    await getParties();
    renderParties();
  }
  render();

async function getParties() {

    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      state.parties = json.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function addParty(event) {
    event.preventDefault();
  
    await createParty(
      addPartyForm.name.value,
      new Date( addPartyForm.date.value),
      addPartyForm.location.value,
      addPartyForm.description.value,
    );
  }

  async function createParty (name, date, location, description) {

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, date, location, description })
    });
    const json = await response.json();
    console.log(json);
    
    } catch (error) {
      console.error();
      
    }
  }

  async function updateParty(id, name, date, location, description) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date, location, description }),
      });
      const json = await response.json();
  
      if (json.error) {
        throw new Error(json.message);
      }
  
      render();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteParty(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      console.log(response.status);
      
      if(!response.ok) {
        throw new Error("Party could not be deleted")
      }
      render();
    } catch (error) {
      console.error(error);
    }
  }

  function renderParties() {
    if (!state.parties.length) {
      partyList.innerHTML = "<li>No parties.</li>";
      return;
    }
  
    const partyCards = state.parties.map((party) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${party.name}</h2>
        <h3>${party.date}</h3>
        <h3>${party.location}</h3>
        <p>${party.description}</p>
      `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Button";
    li.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return li;
  });
  partyList.replaceChildren(...partyCards);
  }

