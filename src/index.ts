import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { PromptTemplate } from "langchain/prompts";
import {
  ChatOpenAI,
  ChatOpenAICallOptions,
} from "langchain/chat_models/openai";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";
import { VectorStoreRetriever } from "langchain/dist/vectorstores/base";
require("dotenv").config();

class Chat {
  private ifSameDocument: string | undefined;
  private load: VectorStoreRetriever<HNSWLib> | undefined;

  constructor() {
    this._conversation = this._conversation.bind(this);
    this._loadDocument = this._loadDocument.bind(this);
    this.ifSameDocument = undefined;
    this.load = undefined;
  }

  public makeResponse = async (question: string) => {
    const key = process.env.OPENAI_API_KEY;

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: key,
    });

    const model = new ChatOpenAI({
      openAIApiKey: key,
    });

    const pathToFile = "JoãoConquista-Currículo.pdf";

    console.log("before: ", this.ifSameDocument ?? "");

    let result;

    if (pathToFile === this.ifSameDocument) {
      result = this._conversation(question, this.load, model);

      return result;
    } else {
      this.load = await this._loadDocument(pathToFile, embeddings);

      result = this._conversation(question, this.load, model);

      this.ifSameDocument = pathToFile;

      return result;
    }
  };

  private _loadDocument = async (
    pathToFile: string,
    embeddings: OpenAIEmbeddings
  ) => {
    let chunks: any = [];

    const pdfLoader = new PDFLoader(pathToFile);

    const pages = await pdfLoader.loadAndSplit();

    chunks = [...pages, ...chunks];

    let vectorStore = await HNSWLib.fromDocuments(pages, embeddings);
    let retriever = vectorStore.asRetriever();
    console.log("Document loaded");

    return retriever;
  };

  private _conversation = async (
    question: string,
    retriever: VectorStoreRetriever<HNSWLib> | undefined,
    model: ChatOpenAI<ChatOpenAICallOptions>
  ) => {
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
          const relevantDocs = await retriever!.getRelevantDocuments(
            input.question
          );
          const serialized = formatDocumentsAsString(relevantDocs);
          return serialized;
        },
      },
      questionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const questionOne = question;

    const resultOne = await chain.invoke({ question: questionOne });

    return resultOne;
  };
}

export const chatInstance = new Chat();
