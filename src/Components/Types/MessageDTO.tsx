export interface MessageDTO {
    sender: "user" | "bot";
    text: string;
}