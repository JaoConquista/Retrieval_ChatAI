const { ChatOpenAI } = require("langchain/chat_models/openai");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const fs = require("fs");
const { PromptTemplate } = require("langchain/prompts");
const { RunnableSequence } = require("langchain/schema/runnable");
const { StringOutputParser } = require("langchain/schema/output_parser");
const { formatDocumentsAsString } = require("langchain/util/document");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf")


const main = async () => {
  /* Initialize the LLM to use to answer the question */
const model = new ChatOpenAI({openAIApiKey: "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"});
/* Load in the file we want to do question answering over */
const text = new PDFLoader("apresentacao.pdf");
/* Split the text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs = await textSplitter.createDocuments([text]);
/* Create the vectorstore */
const vectorStore = await HNSWLib.fromDocuments(docs, OpenAIEmbeddings({
  openAIApiKey: "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",
}));
const retriever = vectorStore.asRetriever();

const formatChatHistory = (
  human: string,
  ai: string,
  previousChatHistory?: string
) => {
  const newInteraction = `Human: ${human}\nAI: ${ai}`;
  if (!previousChatHistory) {
    return newInteraction;
  }
  return `${previousChatHistory}\n\n${newInteraction}`;
};

/**
 * Create a prompt template for generating an answer based on context and
 * a question.
 *
 * Chat history will be an empty string if it's the first question.
 *
 * inputVariables: ["chatHistory", "context", "question"]
 */
const questionPrompt = PromptTemplate.fromTemplate(
  `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
  ----------------
  CONTEXT: {context}
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  QUESTION: {question}
  ----------------
  Helpful Answer:`
);

const chain = RunnableSequence.from([
  {
    question: (input: { question: string; chatHistory?: string }) =>
      input.question,
    chatHistory: (input: { question: string; chatHistory?: string }) =>
      input.chatHistory ?? "",
    context: async (input: { question: string; chatHistory?: string }) => {
      const relevantDocs = await retriever.getRelevantDocuments(input.question);
      const serialized = formatDocumentsAsString(relevantDocs);
      return serialized;
    },
  },
  questionPrompt,
  model,
  new StringOutputParser(),
]);

const questionOne = "What did the president say about Justice Breyer?";

const resultOne = await chain.invoke({
  question: questionOne,
});

console.log({ resultOne });
/**
 * {
 *   resultOne: 'The president thanked Justice Breyer for his service and described him as an Army veteran, Constitutional scholar, and retiring Justice of the United States Supreme Court.'
 * }
 */

const resultTwo = await chain.invoke({
  chatHistory: formatChatHistory(resultOne, questionOne),
  question: "Was it nice?",
});

console.log({ resultTwo });
/**
 * {
 *   resultTwo: "Yes, the president's description of Justice Breyer was positive."
 * }
 */
}

main()