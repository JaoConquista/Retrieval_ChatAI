// import { OpenAI } from "langchain/llms/openai";
// import { FaissStore } from "langchain/vectorstores/faiss";
// // import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
// import { JSONLoader } from "langchain/document_loaders/fs/json";
// import {
//   ConversationChain,
//   ConversationalRetrievalQAChain,
// } from "langchain/chains";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { streamToResponse } from "ai";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RunnableSequence } from "langchain/schema/runnable"
import { StringOutputParser } from "langchain/schema/output_parser"
import { formatDocumentsAsString } from "langchain/util/document"

const main = async () => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: "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",
  });

  const model = new ChatOpenAI({
    openAIApiKey: "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",
  });

  let chunks: any = [];

  const pathToFile = "How_to_Bake_a_Cake.pdf";

  let pdfLoader = new PDFLoader(pathToFile);

  const pages = await pdfLoader.loadAndSplit();

  chunks = [...pages, ...chunks];

  let vectorStore = await HNSWLib.fromDocuments(pages, embeddings);
  let retriever = vectorStore.asRetriever();

  console.log("pages: ", pages);
  console.log("chunks: ", chunks);

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
        const relevantDocs = await retriever.getRelevantDocuments(
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

  const questionOne = "In this cake recipe, what is the first step ?";

  const resultOne = await chain.invoke({question: questionOne,});

  console.log({resultOne})
};

main();
