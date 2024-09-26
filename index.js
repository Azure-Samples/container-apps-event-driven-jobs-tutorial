require("dotenv").config();
const { QueueClient, QueueServiceClient } = require("@azure/storage-queue");
const { DefaultAzureCredential } = require('@azure/identity');

const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const queueName = process.env.AZURE_STORAGE_QUEUE_NAME || "myqueue";

async function main() {
    const queueClient = new QueueClient(`https://${storageAccountName}.queue.core.windows.net/${queueName}`, new DefaultAzureCredential());
    
    // 1. Dequeue one message from the queue
    const response = await queueClient.receiveMessages({
        numberOfMessages: 1,
        visibilityTimeout: 60, // set this to longer than the expected processing time (in seconds)
    });

    if (response.receivedMessageItems.length === 0) {
        console.log("No message received. Exiting...");
        return;
    }

    const message = response.receivedMessageItems[0];
    console.log(`Processing message: ${message.messageText}`);

    // 2. Process the message here

    // 3. Delete the message from the queue
    await queueClient.deleteMessage(message.messageId, message.popReceipt);
    console.log("Message processed");

    // 4. Exit
}

main();