document.addEventListener('DOMContentLoaded', fetchCustomers)
const all = document.querySelector("body > h1.create") as HTMLElement

async function fetchCustomers(): Promise<void> {
    console.log(all)
    try {
        const response = await fetch('http://127.0.0.1:3000');
        const customers = await response.json();
        displayCustomers(customers);
    } catch (err) {
        console.error(err);
    }
}

const displayCustomers = (customers: any) => {
    const list = document.createElement("ul");
    console.log(customers)
    customers.forEach(customer => {
        const item = document.createElement("li");
        item.innerHTML = `${customer.contactFirstName}`;
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener("click", () => {
            item.remove();
            deleteFromDB(customer.customerNumber)
        });
        item.appendChild(deleteBtn);

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.addEventListener("click", () => {
            // function to handle the edit functionality
        });
        item.appendChild(editBtn);

        
        list.appendChild(item);
    });
    all.appendChild(list);
};

const deleteFromDB = async (customerNumber: number) => {
    try {
        const response = await fetch(`http://127.0.0.1:3000/customers/${customerNumber}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
};

