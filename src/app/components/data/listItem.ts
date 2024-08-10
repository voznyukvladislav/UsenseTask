export class ListItem {
    code: string = "";
    name: string = "";

    getString() {
        return `${this.code}: ${this.name}`;
    }
}