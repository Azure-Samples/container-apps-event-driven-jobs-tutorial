require("dotenv").config();
const { QueueClient, QueueServiceClient } = require("@azure/storage-queue");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const queueName = process.env.AZURE_STORAGE_QUEUE_NAME;

async function main() {
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
    const queueClient = queueServiceClient.getQueueClient(queueName);
    
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