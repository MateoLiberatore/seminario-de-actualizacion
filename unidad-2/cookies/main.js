import { ApplicationUI } from "./applicationUI.js";
import { ApplicationModel } from "./applicationModel.js";

function main() {
    let backEnd = new ApplicationModel();
    let frontEnd = new ApplicationUI(backEnd);
    frontEnd.main();
}

window.onload = main;