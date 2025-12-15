const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    endpoint: "http://localhost:4566",
});
const sns = new AWS.SNS({ endpoint: "http://localhost:4566" });

module.exports.handler = async (event) => {
    const body = JSON.parse(event.body);

    // Validação (Requisito 4)
    if (!body.name || !body.description) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Nome e descrição são obrigatórios" }),
        };
    }

    const newItem = {
        id: uuidv4(),
        name: body.name,
        description: body.description,
        createdAt: new Date().toISOString(),
    };

    // 1. Salva no DynamoDB
    await dynamoDb
        .put({
            TableName: process.env.TABLE_NAME,
            Item: newItem,
        })
        .promise();

    // 2. Publica no SNS (Requisito 2)
    await sns
        .publish({
            TopicArn: process.env.TOPIC_ARN,
            Message: JSON.stringify({
                message: "Novo item criado!",
                itemId: newItem.id,
            }),
        })
        .promise();

    return {
        statusCode: 201,
        body: JSON.stringify(newItem),
    };
};
