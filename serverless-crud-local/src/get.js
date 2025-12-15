const AWS = require('aws-sdk');

const endpoint = process.env.LOCALSTACK_HOSTNAME
    ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
    : 'http://localhost:4566';

const dynamoDb = new AWS.DynamoDB.DocumentClient({ endpoint });
const sns = new AWS.SNS({ endpoint });

module.exports.handler = async (event) => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: event.pathParameters.id, // Pega o ID da URL
            },
        };

        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Item não encontrado" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao buscar item" }),
        };
    }
};