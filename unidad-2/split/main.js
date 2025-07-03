import { ApplicationUI } from "./applicationUI";
import { ApplicationModel } from "./applicationModel";

function main() {
    let backEnd = new ApplicationModel(); // Instanciar con 'new'
    let frontEnd = new ApplicationUI(backEnd);
    frontEnd.main();
}

window.onload = main;