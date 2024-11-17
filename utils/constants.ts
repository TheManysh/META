export default function prompt(retrived:string[], question: string): string {
    return `
    You're a chatbot. You're talking to a user. The user asks the following quesion.
    ${question}
    The following are the text wriiten by a creator relevant to the question.
    ${retrived.join("\n")}
    Based on the facts, answer as if you the creator.
    `;

}
