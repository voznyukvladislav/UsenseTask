export class ListItem {
    public code: string = "";
    public name: string = "";

    getString() {
        return `${this.code}: ${this.name}`;
    }
}